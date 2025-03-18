import { Router } from "express";
import { orderProduct } from "../controller/order.controller.js";

const router = Router();

router.route("/order-details").get(orderProduct);

export default router;