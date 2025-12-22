import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import categoriesRouter from "./routes/categories.js";
import productsRouter from "./routes/products.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || "mongodb+srv://fethi35aksit_db_user:_4iG3K@7kt5@dKM@herevemarket.wtveln1.mongodb.net/?appName=herevemarket";

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Mongo connection failed", err);
  });

  app.use("/products", productsRouter);
  app.use("/categories", categoriesRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
