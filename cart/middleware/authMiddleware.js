import { Cart } from "../model/cart.model.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import JWT from "jsonwebtoken";
const authMiddleware = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer", "");
  console.log(token);
  if (!token) {
    return res.status(404).json({ message: "Token not found." });
  }
  const decodedToken = JWT.verify(token, process.env.JWT_SECRET);
  const cart = await Cart.findById(decodedToken._id);
  if (!cart) {
    return res
      .status(404)
      .json({ message: "item not found with the particular token." });
  }
  req.item = cart;
  next();
});

export { authMiddleware };
