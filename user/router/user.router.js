import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/user.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(authMiddleware, logoutUser);
export default router;
