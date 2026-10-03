const express = require("express");
const Product = require("../models/Product");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();
const origins = ["Chikmagalur", "Coorg", "Araku"];
const roasts = ["Light", "Medium", "Dark"];

function validateProduct(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const tastingNotes =
    typeof body.tastingNotes === "string" ? body.tastingNotes.trim() : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const weight = Number(body.weight);
  const price = Number(body.price);
  const stock = Number(body.stock);

  if (!name) return "Name is required";
  if (!origins.includes(body.origin)) {
    return "Origin must be Chikmagalur, Coorg, or Araku";
  }
  if (!roasts.includes(body.roast)) {
    return "Roast must be Light, Medium, or Dark";
  }
  if (!tastingNotes) return "Tasting notes are required";
  if (!Number.isInteger(weight) || weight < 1) {
    return "Weight must be whole grams";
  }
  if (!Number.isInteger(price) || price < 1) {
    return "Price must be whole rupees";
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return "Stock must be a whole number";
  }
  if (!image.startsWith("https://")) return "Image must be an https URL";

  return { name, origin: body.origin, roast: body.roast, tastingNotes, weight, price, stock, image };
}

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.status(200).json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not load products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Coffee not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Coffee not found" });
    }
    console.error(error.message);
    res.status(500).json({ error: "Could not load product" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  const productData = validateProduct(req.body || {});
  if (typeof productData === "string") {
    return res.status(400).json({ error: productData });
  }

  try {
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not create product" });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  const productData = validateProduct(req.body || {});
  if (typeof productData === "string") {
    return res.status(400).json({ error: productData });
  }

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ error: "Coffee not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Coffee not found" });
    }
    console.error(error.message);
    res.status(500).json({ error: "Could not update product" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Coffee not found" });
    }
    res.status(200).json({ message: "Coffee deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Coffee not found" });
    }
    console.error(error.message);
    res.status(500).json({ error: "Could not delete product" });
  }
});

module.exports = router;