import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
          userId: {
                    type: String,
                    required: true
          },
          cartItems: [
                    {
                              productName: {
                                        type: String,
                                        required: true
                              },
                              quantity: {
                                        type: Number,
                                        required: true
                              },
                              price: {
                                        type: Number,
                                        required: true
                              }
                    }
          ],
          totalAmount: {
                    type: Number,
                    required: true
          },
          paymentStatus: {
                    type: String,
                    enum: ['Pending', 'Completed', 'Failed'],
                    default: 'Pending'
          },
          paymentMethod: {
                    type: String,
                    enum: ['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery'],
                    required: true
          },
          createdAt: {
                    type: Date,
                    default: Date.now
          }
});

export const Payment = mongoose.model('Payment', PaymentSchema);