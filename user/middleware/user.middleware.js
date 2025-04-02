import { User } from "../model/user.model.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import JWT from "jsonwebtoken";
const authMiddleware = asyncHandler(async (req, res, next) => {
  console.log(req.cookies.token || req.header("Authorization").replace("Bearer", ""))
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer", "");
  if (!token) {
    return res.status(404).json({ message: "Token not found." });
  }
  const decodedToken = JWT.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decodedToken._id).select("-password");
  if (!user) {
    return res
      .status(404)
      .json({ message: "User not found with the particular token." });
  }
  req.user = user;
  next();
});

export { authMiddleware };
