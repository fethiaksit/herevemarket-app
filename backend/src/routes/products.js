import express from "express";
import { Product } from "../models/product.js";

const router = express.Router();

const normalizeProduct = (item) => {
  const id = item.id || item._id?.toString?.() || "";

  return {
    id,
    name: item.name,
    price: Number(item.price) || 0,
    category: Array.isArray(item.category) ? item.category : [],
    image: item.imageUrl || "",
    isActive: Boolean(item.isActive),
    createdAt: item.createdAt?.toISOString?.() || new Date().toISOString(),
  };
};

router.get("/", async (_req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    const normalized = products.map((item) => normalizeProduct(item));

    res.json({ data: normalized });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, price, category = [], imageUrl = "", isActive = true, createdAt } = req.body ?? {};

    if (!name || typeof price !== "number") {
      return res.status(400).json({ message: "'name' ve 'price' alanları zorunludur." });
    }

    const product = await Product.create({
      name: String(name).trim(),
      price: Number(price),
      category: Array.isArray(category) ? category : [category].filter(Boolean),
      imageUrl: String(imageUrl || ""),
      isActive: Boolean(isActive),
      createdAt: createdAt ? new Date(createdAt) : undefined,
    });

    res.status(201).json({ data: normalizeProduct(product.toJSON()) });
  } catch (error) {
    next(error);
  }
});

export default router;
