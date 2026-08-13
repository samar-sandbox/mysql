import { DB_NAME } from "../../database/db-init.js";
import db from "../../database/db.js";
import { getProductById } from "../products/product.service.js";

export async function getAllSales() {
  const [sales] = await db.execute(`SELECT * FROM ${DB_NAME}.sales`);

  return { message: "Sales retrieved successfully", data: sales };
}

export async function addSale(saleData) {
  if (!saleData) {
    return {
      error: "Missing sale data",
      status: 400,
    };
  }

  const { quantity, date, product_id } = saleData;

  const saleQuantity = parseInt(quantity);
  if (isNaN(saleQuantity) || saleQuantity <= 0) {
    return {
      error: "Invalid quantity sold",
      status: 400,
    };
  }

  if (product_id === null || product_id == undefined) {
    return {
      error: "Product ID is required",
      status: 400,
    };
  }

  const productResult = await getProductById(product_id);
  if (productResult.error) {
    return productResult;
  }

  await db.execute(
    `INSERT INTO ${DB_NAME}.sales (sales_quantity_sold, sales_date, sales_product_id) VALUES (?, ?, ?)`,
    [saleQuantity, date ?? new Date(), product_id],
  );

  return { message: "Sale recorded successfully" };
}

export async function getProductSales(productId) {
  const [sales] = await db.execute(
    `SELECT * FROM ${DB_NAME}.sales s 
    JOIN ${DB_NAME}.products p
    ON s.sales_product_id = p.product_id
    LEFT JOIN ${DB_NAME}.suppliers sp
    ON p.product_supplier_id = sp.supplier_id
    WHERE s.sales_product_id = ?`,
    [productId],
  );

  const salesWithProductDetails = sales.map((sale) => {
    const {
      sales_id,
      sales_quantity_sold,
      sales_date,
      product_id,
      product_name,
      product_price,
      supplier_id,
      supplier_name,
    } = sale;

    return {
      sales_id,
      sales_quantity_sold,
      sales_date,
      product: {
        product_id,
        product_name,
        product_price,
        product_supplier: {
          supplier_id,
          supplier_name,
        },
      },
    };
  });

  return {
    message: "Product sales retrieved successfully",
    data: salesWithProductDetails,
  };
}
