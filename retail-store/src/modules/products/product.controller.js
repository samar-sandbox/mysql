import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "./product.service.js";

const router = Router();

// Retrieve all products
router.get("/", async (req, res) => {
  const result = await getAllProducts();

  return res.status(200).json({ success: true, ...result });
});

// Retrieve product by ID
router.get("/:id", async (req, res) => {
  const productId = req.params.id;

  const result = await getProductById(productId);

  if (result.data) {
    return res.status(200).json({ success: true, ...result });
  }

  return res.status(result.status).json({
    success: false,
    message: result.error,
  });
});

// Create a product
router.post("/", async (req, res) => {
  const productData = req.body;

  const result = await addProduct(productData);

  if (result.data) {
    return res.status(201).json({ success: true, ...result });
  }

  return res.status(result.status).json({
    success: false,
    message: result.error,
  });
});

// Update product by ID
router.patch("/:id", async (req, res) => {
  const productId = req.params.id;
  const productData = req.body;

  const result = await updateProduct(productId, productData);

  if (result.data) {
    return res.status(200).json({ success: true, ...result });
  }

  return res.status(result.status).json({
    success: false,
    message: result.error,
  });
});

// Delete a product by ID
router.delete("/:id", async (req, res) => {
  const productId = req.params.id;

  const result = await deleteProduct(productId);

  if (result?.error) {
    return res.status(result.status).json({
      success: false,
      message: result.error,
    });
  }

  return res.status(200).json({ success: true, ...result });
});

export default router;
