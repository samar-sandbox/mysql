import { Router } from "express";
import { addSale, getAllSales, getProductSales } from "./sale.service.js";

const router = Router();

// Retrieve all sales
router.get("/", async (req, res) => {
  const result = await getAllSales();

  return res.status(200).json({ success: true, ...result });
});

// Retrieve all product sales
router.get("/product/:id", async (req, res) => {
  const productId = req.params.id;

  const result = await getProductSales(productId);

  return res.status(200).json({ success: true, ...result });
});

// Record a sale
router.post("/", async (req, res) => {
  const saleData = req.body;

  const result = await addSale(saleData);

  if (result.error) {
    return res.status(result.status).json({
      success: false,
      message: result.error,
    });
  }

  return res.status(201).json({ success: true, ...result });
});

export default router;
