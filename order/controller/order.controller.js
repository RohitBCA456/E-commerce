import { subscribeToQueue } from "../service/RabbitMQ.js";
import { asyncHandler } from "../utility/asynHandler.js";
import Order from "../model/order.model.js";

const orderProduct = asyncHandler(async (req, res) => {
  try {
    subscribeToQueue("cartPayment", async (data, ack) => {
      const Data = JSON.parse(data);

      const totalAmount =
        Data.totalAmount.totalAmountCalculation[0].totalAmount * 100;
      const productQuantityCalculation = Data.productQuantityCalculation;
      const userId = Data.user;
      const cartItems = productQuantityCalculation.map((product) => ({
        productName: product.productName,
        quantity: product.quantity,
        price: product.Amount,
      }));
      const { payment_method, payment_status } = req.body;
      const order = new Order({
        userId,
        cartItems,
        totalAmount: totalAmount / 100,
        paymentStatus: payment_status,
        paymentMethod: payment_method,
      });
      await order.save();
      ack();
      res.status(200).json({ message: "Order placed successfully" });
    });
  } catch (error) {
    console.log("Error occurred while placing order.", error);
    return res.status(500).json({ message: "Order placement failed." });
  }
});

export { orderProduct };
