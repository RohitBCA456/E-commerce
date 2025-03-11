import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cartData: {
    type: Array,
    required: true
  }
}, {
  timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

export { Cart };