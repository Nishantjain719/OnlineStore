import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import data from "../data.js";
import { isAdmin } from "../utils.js";

//  express.Router() makes code modular bc instead of having all routes in server.js we can define multiple files to have routers
const productRouter = express.Router();

// Create Api  for sending list of products to frontend, Request URL: http://localhost:3000/api/products products api at this address work fine. we also used proxy from localhost:3000 to other.
productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
    const products = await Product.find({}); // in find func i put {} empty obj means return all
    res.send(products);
  })
);

// Create seed Apis at this address http://localhost:5000/api/products/seed to add products to db using seed api
productRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    //await Product.remove({});
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
  })
);

// Create Api for Details of each product, also Request URL: http://localhost:3000/api/products/60ea9bb1cb965708902e4799 Details Api at this address works perfect.
productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
    const product = await Product.findById(req.params.id); // in find func i put {} empty obj means return all
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

export default productRouter;
