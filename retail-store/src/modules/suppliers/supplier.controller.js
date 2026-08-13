import { Router } from "express";
import {
  addSupplier,
  deleteSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
} from "./supplier.service.js";

const router = Router();

// Retrieve all suppliers
router.get("/", async (req, res) => {
  const result = await getAllSuppliers();

  return res.status(200).json({ success: true, ...result });
});

// Retrieve supplier by ID
router.get("/:id", async (req, res) => {
  const supplierId = req.params.id;

  const result = await getSupplierById(supplierId);

  if (result.data) {
    return res.status(200).json({ success: true, ...result });
  }

  return res.status(result.status).json({
    success: false,
    message: result.error,
  });
});

// Create a supplier
router.post("/", async (req, res) => {
  const supplierData = req.body;

  const result = await addSupplier(supplierData);

  if (result.data) {
    return res.status(201).json({ success: true, ...result });
  }

  return res.status(result.status).json({
    success: false,
    message: result.error,
  });
});

// Update supplier by ID
router.patch("/:id", async (req, res) => {
  const supplierId = req.params.id;
  const supplierData = req.body;

  const result = await updateSupplier(supplierId, supplierData);

  if (result.data) {
    return res.status(200).json({ success: true, ...result });
  }

  return res.status(result.status).json({
    success: false,
    message: result.error,
  });
});

// Delete a supplier by ID
router.delete("/:id", async (req, res) => {
  const supplierId = req.params.id;

  const result = await deleteSupplier(supplierId);

  if (result?.error) {
    return res.status(result.status).json({
      success: false,
      message: result.error,
    });
  }

  return res.status(200).json({ success: true, ...result });
});

export default router;
