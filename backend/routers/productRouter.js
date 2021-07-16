import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import data from "../data.js";
import { isAdmin, isAuth } from "../utils.js";

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

productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.send(categories);
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
// Build Create product api in backend and address of this api is goning to be /api/products and also we are passing createdProduct to frontend
productRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: "sample name" + Date.now(),
      image: "/images/p1.jpg",
      price: 0,
      category: "sample category",
      brand: "sample brand",
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: "sample description",
    });
    const createdProduct = await product.save();
    res.send({ message: "Product Created", product: createdProduct });
  })
);

// Create Api to update the product in backend (db) and you will see changes in frontend
productRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId); // get product from db
    if (product) {
      /* fill product info by data from frontend(values that user enter in inputbox) which is from ProductEditScreen when calling this  dispatch(
      updateProduct({  _id: productId, name, price, image, category, brand, countInStock, description, }) ); */
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      const updatedProduct = await product.save();
      res.send({ message: "Product Updated", product: updatedProduct });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deleteProduct = await product.remove();
      res.send({ message: "Product Deleted", product: deleteProduct });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

export default productRouter;
