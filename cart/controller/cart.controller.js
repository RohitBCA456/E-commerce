import { subscribeToQueue } from "../service/RabbitMQ.js";
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
        const { title, price, image, text } = cartDataFromUser.cartData;
        console.log("Received cart data:", cartDataFromUser);

        const newCart = new Cart({
          user_id: userId,
          productName: title,
          price: price,
          image: image,
          text: text,
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
  const cartId = req.params.id;
  if (!cartId) {
    return res.status(400).json({ message: "Cart ID is required." });
  }
  const userCart = await Cart.findByIdAndDelete(cartId);

  if (!userCart) {
    return res.status(404).json({ message: "Item not found" });
  }
  return res
    .status(200)
    .json({ message: "Item deleted successfully from the cart." });
});

const getCartItems = asyncHandler(async (req, res) => {
  const userId = req.params.Id;

  const cartItems = await Cart.find({ user_id: userId });

  if (!cartItems || cartItems.length === 0) {
    return res.status(404).json({ message: "No items found in the cart." });
  }

  return res.status(200).json({ cartItems, length: cartItems.length });
});

const makePaymentOfCart = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
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
  } catch (error) {
    console.error("Error making payment:", error);
    res.status(500).json({ message: "Error making payment" });
  }
});


const deleteCart = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const deletedCart = await Cart.deleteMany({ user_id: userId });
  if (deletedCart.deletedCount === 0) {
    return res.status(404).json({ message: "Cart not found" });
  }
  return res.status(200).json({ message: "Cart deleted successfully." });
});

export {
  addCartToDatabase,
  deleteFromCart,
  makePaymentOfCart,
  deleteCart,
  getCartItems,
};
