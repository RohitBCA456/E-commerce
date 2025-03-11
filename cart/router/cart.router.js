import { Router } from "express";
import {
  addCartToDatabase,
  deleteFromCart,
} from "../controller/cart.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/add-to-database").get(addCartToDatabase);
router.route("/delete/:id").post(authMiddleware, deleteFromCart);

export default router;
