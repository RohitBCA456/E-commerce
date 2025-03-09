import express from "express";
import userRouter from "./router/user.router.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config({path: "./.env"});
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/",userRouter);
export { app };