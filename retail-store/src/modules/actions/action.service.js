import { DB_NAME } from "../../database/db-init.js";
import db from "../../database/db.js";

export async function updateBreadPrice(price = 25) {
  const breadPrice = parseFloat(price);
  if (isNaN(breadPrice)) {
    return {
      error: "Price must be a valid number",
      status: 400,
    };
  }

  const [result] = await db.execute(
    `UPDATE ${DB_NAME}.products SET product_price = ? WHERE product_name LIKE "%bread%"`,
    [breadPrice],
  );

  if (result.affectedRows === 0) {
    return {
      error: "No bread products found",
      status: 404,
    };
  }

  return {
    message: `${result.affectedRows} product(s) price updated to ${breadPrice} successfully`,
  };
}

export async function deleteEggs() {
  const [result] = await db.execute(
    `DELETE FROM ${DB_NAME}.products WHERE product_name LIKE "%egg%"`,
  );

  if (result.affectedRows === 0) {
    return {
      error: "No egg products found",
      status: 404,
    };
  }

  return {
    message: `${result.affectedRows} product(s) deleted successfully`,
  };
}
