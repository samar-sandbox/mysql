import { Router } from "express";
import {
  addProductCategoryColumn,
  addProductNameNotNullConstraint,
  changeSupplierContactNumberLength,
  removeProductCategoryColumn,
} from "./schema-modifications.service.js";

const router = Router();

// Add a category column to products
router.post("/add-product-category", async (req, res) => {
  const result = await addProductCategoryColumn();

  return res.status(201).json({ success: true, ...result });
});

// Remove the category column from products
router.delete("/remove-product-category", async (req, res) => {
  const result = await removeProductCategoryColumn();

  return res.status(200).json({ success: true, ...result });
});

// Change supplier contact number to VARCHAR(15)
router.patch("/contact-number-length", async (req, res) => {
  const result = await changeSupplierContactNumberLength();

  return res.status(200).json({ success: true, ...result });
});

// Add a NOT NULL constraint to product name
router.post("/product-name-not-null", async (req, res) => {
  const result = await addProductNameNotNullConstraint();

  return res.status(200).json({ success: true, ...result });
});

export default router;
