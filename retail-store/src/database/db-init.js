import db from "./db.js";

export const DB_NAME = "retail_store";

async function createTables() {
  // Create suppliers table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS ${DB_NAME}.suppliers (
      supplier_id INT AUTO_INCREMENT PRIMARY KEY,
      supplier_name VARCHAR(255) NOT NULL,
      supplier_contact_number VARCHAR(50)
    )
  `);
  console.log("✔ table suppliers created");

  // Create products table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS ${DB_NAME}.products (
      product_id INT AUTO_INCREMENT PRIMARY KEY,
      product_name VARCHAR(100) NOT NULL,
      product_price DECIMAL(10, 2) NOT NULL,
      product_stock_quantity INT DEFAULT 0,
      product_supplier_id INT,

      CONSTRAINT FOREIGN KEY (product_supplier_id) REFERENCES ${DB_NAME}.suppliers (supplier_id)
        ON DELETE SET NULL ON UPDATE CASCADE
    )
  `);
  console.log("✔ table products created");

  // Create sales table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS ${DB_NAME}.sales (
      sales_id INT AUTO_INCREMENT PRIMARY KEY,
      sales_quantity_sold INT NOT NULL,
      sales_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      sales_product_id INT NOT NULL,

      CONSTRAINT FOREIGN KEY (sales_product_id) REFERENCES ${DB_NAME}.products (product_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
  console.log("✔ table sales created");
}

async function insertData() {
  console.log(">>>>>> Inserting initial data");

  // Add a supplier with the name 'FreshFoods' and contact number '01001234567'
  const [supplierResult] = await db.execute(
    `
    INSERT INTO ${DB_NAME}.suppliers (supplier_name, supplier_contact_number)
    VALUES (?, ?)
  `,
    ["FreshFoods", "01001234567"],
  );
  const supplierId = supplierResult.insertId;
  console.log("✔ Supplier added");

  /*
  Insert the following three products, all provided by 'FreshFoods':
    i. 'Milk' with a price of 15.00 and stock quantity of 50.
    ii. 'Bread' with a price of 10.00 and stock quantity of 30.
    iii. 'Eggs' with a price of 20.00 and stock quantity of 40.
  */
  const products = [
    ["Milk", 15.0, 50, supplierId],
    ["Bread", 10.0, 30, supplierId],
    ["Eggs", 20.0, 40, supplierId],
  ];
  const [productsResult] = await db.query(
    `
     INSERT INTO ${DB_NAME}.products (product_name, product_price, product_stock_quantity, product_supplier_id)
     VALUES ?
   `,
    [products],
  );
  const milkId = productsResult.insertId;
  console.log("✔ Products added");

  // Add a record for the sale of 2 units of 'Milk' made on '2025-05-20'
  await db.execute(
    `
     INSERT INTO ${DB_NAME}.sales (sales_quantity_sold, sales_date, sales_product_id)
     VALUES (?, ?, ?)
   `,
    [2, "2025-05-20", milkId],
  );
  console.log("✔ Sales record added");
}

export async function initDatabase() {
  console.log(">>>>>> Initializing database");

  // Create database
  await db.execute(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
  console.log(`✔ database ${DB_NAME} created`);

  // Create tables
  await createTables();

  // Insert initial data
  await insertData();

  console.log(">>>>>> Database initialized successfully");
}
