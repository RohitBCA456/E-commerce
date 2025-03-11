import { Router } from "express";
import {
  addCartToDatabase,
  deleteFromCart,
} from "../controller/cart.controller.js";

const router = Router();

router.route("/add-to-database").get(addCartToDatabase);
router.route("/delete/:id").delete(deleteFromCart);

export default router;
