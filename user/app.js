import express from "express";
import userRouter from "./router/user.router.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config({path: "./.env"});
import { connect } from "./service/RabbitMQ.js";
const app = express();
connect();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/",userRouter);
export { app };