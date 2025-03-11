import { Router } from "express";
import { addCartToDatabase } from "../controller/cart.controller.js";

const router = Router();

router.route("/add-to-database").get(addCartToDatabase);

export default router;