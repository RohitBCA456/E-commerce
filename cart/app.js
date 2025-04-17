import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cartRouter from "./router/cart.router.js";
import { connect } from "./service/RabbitMQ.js";
import cookieParser from "cookie-parser";
dotenv.config({ path: "./.env" });
const app = express();
connect();
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/", cartRouter);
export { app };
