import { DB_NAME } from "../../database/db-init.js";
import db from "../../database/db.js";

export async function getAllSuppliers() {
  const [suppliers] = await db.execute(`SELECT * FROM ${DB_NAME}.suppliers`);

  return { message: "Suppliers retrieved successfully", data: suppliers };
}

export async function getSupplierById(supplierId) {
  const [result] = await db.execute(
    `SELECT * FROM ${DB_NAME}.suppliers WHERE supplier_id = ?`,
    [supplierId],
  );

  if (result.length === 0) {
    return {
      error: "Supplier not found",
      status: 404,
    };
  }

  return { message: "Supplier retrieved successfully", data: result[0] };
}

export async function addSupplier(supplierData) {
  if (!supplierData) {
    return {
      error: "Missing supplier data",
      status: 400,
    };
  }

  const { name, contact_number } = supplierData;

  if (!name) {
    return {
      error: "Supplier name is required",
      status: 400,
    };
  }

  const [result] = await db.execute(
    `INSERT INTO ${DB_NAME}.suppliers (supplier_name, supplier_contact_number) VALUES (?, ?)`,
    [name, contact_number ?? null],
  );

  const supplierId = result.insertId;
  const supplierResult = await getSupplierById(supplierId);

  if (!supplierResult.data) {
    return supplierResult;
  }

  return { message: "Supplier added successfully", data: supplierResult.data };
}

export async function updateSupplier(supplierId, supplierData) {
  if (!supplierData) {
    return {
      error: "Missing supplier data",
      status: 400,
    };
  }

  const supplierResult = await getSupplierById(supplierId);
  if (!supplierResult.data) {
    return supplierResult;
  }

  const { name, contact_number } = supplierData;

  const newName = name ?? supplierResult.data.supplier_name;
  const newContactNum =
    contact_number ?? supplierResult.data.supplier_contact_number;

  const [result] = await db.execute(
    `UPDATE ${DB_NAME}.suppliers SET supplier_name = ?, supplier_contact_number = ? WHERE supplier_id = ?`,
    [newName, newContactNum, supplierId],
  );

  return {
    message: "Supplier updated successfully",
    data: {
      ...supplierResult.data,
      supplier_name: newName,
      supplier_contact_number: newContactNum,
    },
  };
}

export async function deleteSupplier(supplierId) {
  const [result] = await db.execute(
    `DELETE FROM ${DB_NAME}.suppliers WHERE supplier_id = ?`,
    [supplierId],
  );

  if (!result.affectedRows) {
    return {
      error: "Supplier not found",
      status: 404,
    };
  }

  return { message: "Supplier deleted successfully" };
}
