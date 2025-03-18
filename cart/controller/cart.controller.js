import { subscribeToQueue } from "../../user/service/RabbitMQ.js";
import { Cart } from "../model/cart.model.js";
import { publishToQueue } from "../service/RabbitMQ.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import mongoose from "mongoose";

const addCartToDatabase = asyncHandler(async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "Processing cart data. Check logs for progress." });

    subscribeToQueue("addToCart", async (data, msg) => {
      try {
        const cartDataFromUser = JSON.parse(data);

        if (
          !cartDataFromUser ||
          !cartDataFromUser.userId ||
          !cartDataFromUser.cartData
        ) {
          throw new Error("Invalid message structure received from queue.");
        }

        const userId = cartDataFromUser.userId;
        const { name, price } = cartDataFromUser.cartData;
        console.log("Received cart data:", cartDataFromUser);

        const newCart = new Cart({
          user_id: userId,
          productName: name,
          price: price,
        });

        await newCart.save();
      } catch (error) {
        console.error("Error processing message from queue:", error.message);
      }
    });
  } catch (error) {
    console.error("Error saving cart data to database:", error.message);
  }
});

const deleteFromCart = asyncHandler(async (req, res) => {
  const userCart = await Cart.findByIdAndDelete(req.params.id);
  if (!userCart) {
    return res.status(404).json({ message: "Item not found" });
  }
  return res
    .status(200)
    .json({ message: "Item deleted successfully from the cart." });
});

const makePaymentOfCart = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const totalAmountResult = await Cart.aggregate([
    {
      $match: { user_id: new mongoose.Types.ObjectId(userId) },
    },
    {
      $facet: {
        totalAmountCalculation: [
          {
            $group: {
              _id: "$user_id",
              totalAmount: { $sum: "$price" },
            },
          },
        ],
        productQuantityCalculation: [
          {
            $group: {
              _id: "$productName",
              quantity: { $sum: 1 },
              Amount: { $first: "$price" },
            },
          },
          {
            $project: {
              _id: 0,
              productName: "$_id",
              quantity: 1,
              totalAmount: 1,
              Amount: 1,
            },
          },
        ],
      },
    },
  ]);

  const productData = {
    totalAmount: totalAmountResult[0],
  };
  publishToQueue("cartPayment", JSON.stringify(productData));
  res.send({ productData });
});

export { addCartToDatabase, deleteFromCart, makePaymentOfCart };
