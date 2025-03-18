import Stripe from "stripe";
import { Payment } from "../model/payment.model.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { publishToQueue, subscribeToQueue } from "../service/RabbitMQ.js";

const cartPayment = asyncHandler(async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { paymentMethod, userId } = req.body;
  let paymentStatus;
  if (typeof paymentMethod !== "string") {
    return res.status(400).json({
      message: "Invalid payment method format. It should be a string.",
    });
  }

  console.log("Payment method received:", paymentMethod);

  subscribeToQueue("cartPayment", async (data, ack) => {
    try {
      const Data = JSON.parse(data);

      const totalAmount = Data.totalAmount.totalAmountCalculation[0].totalAmount * 100;
      const productQuantityCalculation = Data.totalAmount.productQuantityCalculation;

      const cartItems = productQuantityCalculation.map((product) => ({
        productName: product.productName,
        quantity: product.quantity,
        price: product.Amount,
      }));

      console.log(`Processing payment: ${totalAmount} INR`);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: "inr",
        payment_method_types: [paymentMethod],
      });
      if (paymentMethod !== "Cash on Delivery") {
        paymentStatus = "Completed";
      }
      console.log("Payment Intent Created:", paymentIntent);

      const paymentConfirmation = await stripe.paymentIntents.confirm(
        paymentIntent.id,
        {
          payment_method: "pm_card_visa",
        }
      );

      console.log("Payment Confirmed:", paymentConfirmation);

      if (paymentConfirmation.status === "succeeded") {
        const newPayment = new Payment({
          userId,
          cartItems,
          totalAmount: totalAmount / 100,
          paymentStatus: paymentStatus || "Pending",
          paymentMethod,
        });

        await newPayment.save();
        console.log("Payment successfully saved to the database.");

        if (!res.headersSent) {
          return res.status(200).json({
            message: "Payment successfully processed.",
            paymentDetails: paymentConfirmation,
          });
        }
      } else {
        console.error(
          "Payment processing failed: Payment confirmation failed."
        );

        if (!res.headersSent) {
          return res.status(400).json({
            message: "Payment failed",
            error: "Payment confirmation failed.",
          });
        }
      }
    } catch (error) {
      console.error("Error processing payment:", error.message);
      if (!res.headersSent) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
});

const orderDetails = asyncHandler(async (req,res) => {
  const userId = req.params.id;
  const products = await Payment.findOne({ userId });
  if (!products) {
    return res.status(404).json({ message: "No payments found." });
  }
  publishToQueue("orderDetails", JSON.stringify(products));
  return res.status(200).json({ message: "Order details fetched successfully." });
})

export { cartPayment, orderDetails };
