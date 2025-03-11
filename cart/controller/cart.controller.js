import { subscribeToQueue } from "../../user/service/RabbitMQ.js";
import { Cart } from "../model/cart.model.js";
import { asyncHandler } from "../utility/asyncHandler.js";

const addCartToDatabase = asyncHandler(async (req, res) => {
  try {
    let token;
    subscribeToQueue("addToCart", async (data) => {
      try {
        const cartDataFromUser = JSON.parse(data);

        if (
          !cartDataFromUser ||
          !cartDataFromUser.userId ||
          !cartDataFromUser.cartData
        ) {
          throw new Error("Invalid message structure received from queue.");
        }

        const { userId, cartData } = cartDataFromUser;

        console.log("Received cart data:", cartDataFromUser);

        let userCart = await Cart.findOne({ user_id: userId });

        if (userCart) {
          userCart.cartData.push(cartData);
          await userCart.save();
          console.log("Cart data updated successfully for existing user.");
        } else {
          const newCart = new Cart({
            user_id: userId,
            cartData: cartData,
          });
          await newCart.save();
          token = await newCart.generateToken();
          newCart.token = token;
          const options = {
            httpOnly: true,
            secure: true,
          };
          newCart.save({ validateBeforeSave: false });
          console.log("Cart data saved to database successfully for new user.");
          return res.status(200).cookie("token", token, options).json({
            message: "Cart data updated successfully for existing user.",
          });
        }
      } catch (error) {
        console.error("Error processing message from queue:", error.message);
      }
    });
  } catch (error) {
    console.error("Error saving cart data to database:", error.message);
  }
});

const deleteFromCart = asyncHandler(async (req, res) => {
});

export { addCartToDatabase, deleteFromCart };
