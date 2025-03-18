import { subscribeToQueue } from "../service/RabbitMQ.js";
import { asyncHandler } from "../utility/asynHandler.js";
import Order from "../model/order.model.js";

const orderProduct = asyncHandler(async (req, res) => {
  try {
    subscribeToQueue("orderDetails", async (data, ack) => {
      const Data = JSON.parse(data);
      console.log("Received Data:", Data);

      const totalAmount = Data.totalAmount * 100;
      const productQuantityCalculation = Data.cartItems;
      const userId = Data.userId;
      const payment_method = Data.paymentMethod;
      const payment_status = Data.paymentStatus;
      const payment_id = Data._id;
      const isPaid = payment_status === "Completed";

      for (const product of productQuantityCalculation) {
        const order = new Order({
          userId,
          orderItems: [
            {
              name: product.productName,
              qty: product.quantity,
              price: product.price,
            },
          ],
          totalAmount: product.price * product.quantity,
          paymentStatus: payment_status,
          paymentMethod: payment_method,
          paymentId: payment_id,
          isPaid,
        });

        await order.save();
        console.log(`Order saved for item: ${product.productName}`);
      }
    });

    res.status(200).json({ message: "Ordered products saved to database." });
  } catch (error) {
    console.log("Error occurred while placing order.", error);
    return res.status(500).json({ message: "Order placement failed." });
  }
});

export { orderProduct };
