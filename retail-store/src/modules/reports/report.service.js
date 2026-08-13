import { DB_NAME } from "../../database/db-init.js";
import db from "../../database/db.js";

export async function getProductSales() {
  const [products] = await db.execute(`
    SELECT p.product_id, p.product_name, SUM(s.sales_quantity_sold) AS total_quantity_sold 
    FROM ${DB_NAME}.products p
    LEFT JOIN ${DB_NAME}.sales s
    ON s.sales_product_id = p.product_id
    GROUP BY p.product_id
  `);

  if (products.length === 0) {
    return {
      error: "No Products found",
      status: 404,
    };
  }

  const sales = products.map((product) => ({
    ...product,
    total_quantity_sold: parseInt(product.total_quantity_sold ?? 0),
  }));

  return {
    message: "Products retreived successfully",
    data: sales,
  };
}

export async function getHighestStockProduct() {
  const [products] = await db.execute(`
    SELECT * FROM ${DB_NAME}.products 
    ORDER BY product_stock_quantity DESC 
    LIMIT 1
  `);

  if (products.length === 0) {
    return {
      error: "No Products found",
      status: 404,
    };
  }

  return {
    message: "Product retreived successfully",
    data: products[0],
  };
}

export async function filterSuppliersByName(name = "F") {
  const [suppliers] = await db.execute(
    `SELECT * FROM ${DB_NAME}.suppliers WHERE supplier_name LIKE ?`,
    [`${name}%`],
  );

  if (suppliers.length === 0) {
    return {
      error: `No Suppliers starting with '${name}' found`,
      status: 404,
    };
  }

  return {
    message: `Suppliers starting with '${name}' retreived successfully`,
    data: suppliers,
  };
}

export async function getNoSalesProducts() {
  const [products] = await db.execute(`
    SELECT p.*, sp.supplier_name FROM ${DB_NAME}.products p
    LEFT JOIN ${DB_NAME}.sales s
    ON s.sales_product_id = p.product_id
    LEFT JOIN ${DB_NAME}.suppliers sp
    ON p.product_supplier_id = sp.supplier_id
    WHERE s.sales_product_id IS NULL
  `);

  const productsWithSupplier = products.map((product) => {
    const {
      product_supplier_id: supplier_id,
      supplier_name,
      ...productData
    } = product;

    return { ...productData, product_supplier: { supplier_id, supplier_name } };
  });

  return {
    message: "Products with no sales retrieved successfully",
    data: productsWithSupplier,
  };
}

export async function getAllSales() {
  const [sales] = await db.execute(`
    SELECT p.product_name, s.sales_quantity_sold, s.sales_date
    FROM ${DB_NAME}.sales s
    JOIN ${DB_NAME}.products p
    ON s.sales_product_id = p.product_id
  `);

  return { message: "Sales retrieved successfully", data: sales };
}
