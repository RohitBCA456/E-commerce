import express from "express";
import dotenv from "dotenv";
import paymentRouter from "./router/payment.router.js";
import { connect } from "../user/service/RabbitMQ.js";

dotenv.config({ path: "./.env" });
const app = express();
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/",paymentRouter);

export { app };