import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";
import uploadRouter from "./routers/uploadRouter.js";

dotenv.config();
const app = express();
// we need to parse body of http req, by using these two middlewares to express all req that contains data will be translated(converted) to  req.body in your node app.
app.use(express.json()); // by running this line we add new middleware which is parsing json data in body of req
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/Ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use("/api/uploads", uploadRouter);
// in this case userRouter should response.
app.use("/api/users", userRouter);
// we are going to send data from db not return static data in data.js
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
const __dirname = path.resolve(); // it returns current folder
app.use("/uploads", express.static(path.join(__dirname, "/uploads"))); // when you put /uploads in url it serves file inside uploads folder
app.get("/", (req, res) => {
  res.send("Server is ready");
});

// error catcher bc when there is an error in Your router and its wrapped in expressAsynshandler all error will be redirected to this below fun(middleware) and will be sent back to frontend.
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
