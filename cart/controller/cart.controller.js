import { subscribeToQueue } from "../../user/service/RabbitMQ.js";
import { Cart } from "../model/cart.model.js";

const addCartToDatabase = async () => {
  try {
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
          console.log("Cart data saved to database successfully for new user.");
        }
      } catch (error) {
        console.error("Error processing message from queue:", error.message);
      }
    });
  } catch (error) {
    console.error("Error saving cart data to database:", error.message);
  }
};

export { addCartToDatabase };
