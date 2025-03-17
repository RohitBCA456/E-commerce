import { Router } from "express";
import {
  addToCart,
  changePassword,
  loginUser,
  logoutUser,
  registerUser,
} from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/user.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(authMiddleware, logoutUser);
router.route("/change-password").post(authMiddleware, changePassword);
router.route("/add-to-cart").post(authMiddleware, addToCart);

export default router;
