import { Router } from "express";
import {
  filterSuppliersByName,
  getAllSales,
  getHighestStockProduct,
  getNoSalesProducts,
  getProductSales,
} from "./report.service.js";

const router = Router();

// Retrieve the total quantity sold for each product
router.get("/product-sales", async (req, res) => {
  const result = await getProductSales();

  if (result.data) {
    return res.status(200).json({ success: true, ...result });
  }

  return res
    .status(result.status)
    .json({ success: false, message: result.error });
});

// Retrieve the product with the highest stock quantity
router.get("/high-stock", async (req, res) => {
  const result = await getHighestStockProduct();

  if (result.data) {
    return res.status(200).json({ success: true, ...result });
  }

  return res
    .status(result.status)
    .json({ success: false, message: result.error });
});

// Retrieve filtered suppliers by name
router.get("/filter-suppliers", async (req, res) => {
  const name = req.query.name;

  const result = await filterSuppliersByName(name);

  if (result.data) {
    return res.status(200).json({ success: true, ...result });
  }

  return res
    .status(result.status)
    .json({ success: false, message: result.error });
});

// Retrieve all products that have never been sold
router.get("/no-sales-products", async (req, res) => {
  const result = await getNoSalesProducts();

  return res.status(200).json({ success: true, ...result });
});

// Retrieve all sales with product name, quantity sold, and sale date
router.get("/sales", async (req, res) => {
  const result = await getAllSales();

  return res.status(200).json({ success: true, ...result });
});

export default router;
