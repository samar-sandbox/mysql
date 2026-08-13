import { DB_NAME } from "../../database/db-init.js";
import db from "../../database/db.js";

export async function addProductCategoryColumn() {
  await db.execute(
    `ALTER table ${DB_NAME}.products ADD COLUMN IF NOT EXISTS product_category VARCHAR(100)`,
  );

  return { message: "Column category added to the product table successfully" };
}

export async function removeProductCategoryColumn() {
  await db.execute(
    `ALTER table ${DB_NAME}.products DROP COLUMN IF EXISTS product_category`,
  );

  return {
    message: "Column category removed from the product table successfully",
  };
}

export async function changeSupplierContactNumberLength() {
  await db.execute(
    `ALTER table ${DB_NAME}.suppliers MODIFY COLUMN supplier_contact_number VARCHAR(15)`,
  );

  return {
    message: "Supplier contact number changed to VARCHAR(15) successfully",
  };
}

export async function addProductNameNotNullConstraint() {
  await db.execute(
    `ALTER table ${DB_NAME}.products MODIFY COLUMN product_name VARCHAR(100) NOT NULL`,
  );

  return {
    message: "NOT NULL constraint added to product name successfully",
  };
}
