import { asyncHandler } from "../utility/asyncHandler.js";
import Payment from "../models/payment.model.js";
import { processPayment } from "../services/paymentService.js";

const cartPayment = asyncHandler(async(req,res) => {
          const { userId, cartItems, totalAmount, paymentMethod } = req.body;

          const paymentResult = await processPayment({ userId, cartItems, totalAmount, paymentMethod });

          if (!paymentResult.success) {
                    return res.status(400).json({
                              success: false,
                              message: paymentResult.message
                    });
          }

          const payment = new Payment({
                    userId,
                    cartItems,
                    totalAmount,
                    paymentMethod,
                    status: 'Pending'
          });

          await payment.save();

          res.status(201).json({
                    success: true,
                    data: payment
          });
})