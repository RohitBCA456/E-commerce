import express from "express";
import proxy from "express-http-proxy";
const app = express();

app.use("/user",proxy("http://localhost:4001"));

app.listen(4000, () => {
          console.log("Gateway server running on port : 4000");
})