import { Router } from "express";
import {
  addCartToDatabase,
  deleteFromCart,
  makePaymentOfCart,
} from "../controller/cart.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/add-to-database").get(addCartToDatabase);
router.route("/delete/:id").post(authMiddleware, deleteFromCart);
router.route("/make-payement-cart").get(authMiddleware, makePaymentOfCart);

export default router;
