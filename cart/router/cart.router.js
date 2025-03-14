import { Router } from "express";
import {
  addCartToDatabase,
  deleteFromCart,
  makePaymentOfCart,
} from "../controller/cart.controller.js";

const router = Router();

router.route("/add-to-database").get(addCartToDatabase);
router.route("/delete/:id").post(deleteFromCart);
router.route("/make-payement-cart/:id").get(makePaymentOfCart);

export default router;
