import { Router } from "express";
import { cartPayment, orderDetails } from "../controller/payment.controller.js";

const router = Router();

router.route("/cart-payment").post(cartPayment);
router.route("/order-details/:id").get(orderDetails);

export default router;