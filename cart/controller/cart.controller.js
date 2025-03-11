import { subscribeToQueue } from "../../user/service/RabbitMQ.js";
import { Cart } from "../model/cart.model.js";

const addCartToDatabase = async () => {
  try {
    subscribeToQueue("addToCart", async (data) => {
      try {
        const cartDataFromUser = JSON.parse(data);
        if (
          cartDataFromUser ||
          !cartDataFromUser.userId ||
          !cartDataFromUser.cartData
        ) {
          throw new Error("Invalid message structure received from queue.");
        }

        const { userId, cartData } = cartDataFromUser;

        console.log("Received cart data:", cartDataFromUser);

        const newCart = new Cart({
          user_id: userId,
          cartData: cartData,
        });

        await newCart.save();
        console.log("Cart data saved to database successfully.");
      } catch (error) {
        console.error("Error processing message from queue:", error.message);
      }
    });
  } catch (error) {
    console.error("Error saving cart data to database:", error.message);
  }
};

export { addCartToDatabase };
