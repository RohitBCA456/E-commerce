import { Router } from "express";
import {
  addCartToDatabase,
  deleteCart,
  deleteFromCart,
  makePaymentOfCart,
} from "../controller/cart.controller.js";

const router = Router();

router.route("/add-to-database").get(addCartToDatabase);
router.route("/delete/:id").post(deleteFromCart);
router.route("/make-payement-cart/:id").get(makePaymentOfCart);
router.route("/delete-cart/:id").get(deleteCart);

export default router;
