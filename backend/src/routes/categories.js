import express from "express";
import { Category } from "../models/category.js";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    const normalized = categories.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      isActive: Boolean(item.isActive),
      createdAt: item.createdAt?.toISOString?.() || new Date().toISOString(),
    }));

    res.json({ data: normalized });
  } catch (error) {
    next(error);
  }
});

export default router;
