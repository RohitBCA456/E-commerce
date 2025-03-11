import mongoose from "mongoose";
import JWT from "jsonwebtoken";

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartData: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
      },
    ],
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.methods.generateToken = async function () {
  return JWT.sign(
    {
      _id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const Cart = mongoose.model("Cart", cartSchema);

export { Cart };
