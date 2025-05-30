import express from "express";
import proxy from "express-http-proxy";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true,
  methods: 'GET, POST, PUT, DELETE'
}))

app.use("/user", proxy(process.env.USER_ROUTE));
app.use("/cart", proxy(process.env.CART_ROUTE));
app.use("/payment", proxy(process.env.PAYMENT_ROUTE));
app.use("/order", proxy(process.env.ORDER_ROUTE));
app.listen(process.env.PORT, () => {
  console.log("Gateway server running on port : ", process.env.PORT);
});
