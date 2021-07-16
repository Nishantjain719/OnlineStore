import multer from "multer";
import express from "express";
import { isAuth } from "../utils.js";

const uploadRouter = express.Router();
// we can upload a file to cloud server like s3 but here we use a folder in this project as a storage of images, we create an Api that save file in uploads folder  and set file name to timestemp.jpg
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

uploadRouter.post("/", isAuth, upload.single("image"), (req, res) => {
  res.send(`/${req.file.path}`);
});

export default uploadRouter;
