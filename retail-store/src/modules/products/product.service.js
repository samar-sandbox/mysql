import { DB_NAME } from "../../database/db-init.js";
import db from "../../database/db.js";
import { getSupplierById } from "../suppliers/supplier.service.js";

export async function getAllProducts() {
  const [products] = await db.execute(`SELECT * FROM ${DB_NAME}.products`);

  return { message: "Products retrieved successfully", data: products };
}

export async function getProductById(productId) {
  const [result] = await db.execute(
    `SELECT p.*, s.supplier_name FROM ${DB_NAME}.products p 
    LEFT JOIN ${DB_NAME}.suppliers s 
    ON p.product_supplier_id = s.supplier_id
    WHERE p.product_id = ?`,
    [productId],
  );

  if (result.length === 0) {
    return {
      error: "Product not found",
      status: 404,
    };
  }

  const {
    supplier_name,
    product_supplier_id: supplier_id,
    ...productData
  } = result[0];

  return {
    message: "Product retrieved successfully",
    data: { ...productData, supplier: { supplier_id, supplier_name } },
  };
}

export async function addProduct(productData) {
  if (!productData) {
    return {
      error: "Missing product data",
      status: 400,
    };
  }

  const { name, price, stock_quantity, supplier_id } = productData;

  if (!name) {
    return {
      error: "Product name is required",
      status: 400,
    };
  }

  const productPrice = parseFloat(price);
  if (isNaN(productPrice)) {
    return {
      error: "Product price must be a valid number",
      status: 400,
    };
  }

  const productStockQuantity = parseInt(stock_quantity ?? 0);
  if (isNaN(productStockQuantity) || productStockQuantity < 0) {
    return {
      error: "Product stock quantity must be a non-negative integer",
      status: 400,
    };
  }

  if (supplier_id !== null && supplier_id !== undefined) {
    const supplierResult = await getSupplierById(supplier_id);
    if (supplierResult.error) {
      return supplierResult;
    }
  }

  const [result] = await db.execute(
    `INSERT INTO ${DB_NAME}.products (product_name, product_price, product_stock_quantity, product_supplier_id) VALUES (?, ?, ?, ?)`,
    [name, productPrice, productStockQuantity, supplier_id ?? null],
  );

  const productId = result.insertId;
  const productResult = await getProductById(productId);

  if (!productResult.data) {
    return productResult;
  }

  return { message: "Product added successfully", data: productResult.data };
}

export async function updateProduct(productId, productData) {
  if (!productData) {
    return {
      error: "Missing product data",
      status: 400,
    };
  }

  const productResult = await getProductById(productId);
  if (!productResult.data) {
    return productResult;
  }

  const { name, price, stock_quantity } = productData;

  const newName = name ?? productResult.data.product_name;
  const newPrice = parseFloat(price ?? productResult.data.product_price);
  const newStock = parseInt(
    stock_quantity ?? productResult.data.product_stock_quantity,
  );

  if (isNaN(newPrice)) {
    return {
      error: "Product price must be a valid number",
      status: 400,
    };
  }

  if (isNaN(newStock) || newStock < 0) {
    return {
      error: "Product stock quantity must be a non-negative integer",
      status: 400,
    };
  }

  const [result] = await db.execute(
    `UPDATE ${DB_NAME}.products SET product_name = ?, product_price = ?, product_stock_quantity = ? WHERE product_id = ?`,
    [newName, newPrice, newStock, productId],
  );

  return {
    message: "Product updated successfully",
    data: {
      ...productResult.data,
      product_name: newName,
      product_price: newPrice,
      product_stock_quantity: newStock,
    },
  };
}

export async function deleteProduct(productId) {
  const [result] = await db.execute(
    `DELETE FROM ${DB_NAME}.products WHERE product_id = ?`,
    [productId],
  );

  if (!result.affectedRows) {
    return {
      error: "Product not found",
      status: 404,
    };
  }

  return { message: "Product deleted successfully" };
}
