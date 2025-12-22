import express from "express";
import { Category } from "../models/category.js";

const router = express.Router();
router.get("/", (req, res) => {
  res.json({ message: "categories ok" });
});


export default router;
