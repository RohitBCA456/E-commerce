import { Payment } from "../model/payment.model.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { subscribeToQueue } from "../service/RabbitMQ.js";

const cartPayment = asyncHandler(async (req, res) => {
  const { paymentMethod, userId } = req.body;

  if (typeof paymentMethod !== 'string') {
    return res.status(400).json({ message: "Invalid payment method format. It should be a string." });
  }

  console.log("Payment method received:", paymentMethod);

  let isResponseSent = false;

  subscribeToQueue("cartPayment", async (data) => {

    try {
      const Data = JSON.parse(data);

      const totalAmount = Data.totalAmountCalculation[0].totalAmount;
      const productQuantityCalculation = Data.productQuantityCalculation;

      const cartItems = productQuantityCalculation.map((product) => ({
        productName: product.productName,
        quantity: product.quantity,
        price: product.Amount,
      }));

      const newPayment = new Payment({
        userId,
        cartItems,
        totalAmount,
        paymentStatus: "Pending",
        paymentMethod
      });

      await newPayment.save();
      console.log("Payment successfully saved to the database.");

      if (!isResponseSent) {
        isResponseSent = true;
        return res.status(200).json({ message: "Payment processing completed successfully." });
      }
    } catch (error) {
      console.error("Error parsing data from RabbitMQ or saving to DB:", error.message);
      if (!isResponseSent) {
        isResponseSent = true;
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
});

export { cartPayment };
