import { Router } from "express";
import { cartPayment } from "../controller/payment.controller.js";

const router = Router();

router.route("/cart-payment").post(cartPayment);

export default router;