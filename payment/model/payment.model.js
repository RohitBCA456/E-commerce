import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
          userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
          },
          cartItems: [
                    {
                              productId: {
                                        type: Schema.Types.ObjectId,
                                        ref: 'cartData',
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