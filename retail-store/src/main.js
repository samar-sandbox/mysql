import express from "express";
import errorHandler from "./middlewares/error-handler.middleware.js";
import db from "./database/db.js";
import config from "./config/config.js";
import { initDatabase } from "./database/db-init.js";
import {
  suppliersController,
  productsController,
  salesController,
  schemaController,
  actionsController,
  reportsController,
  adminController,
} from "./modules/index.js";

const port = config.port;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "Retail Store API is running" });
});

app.use("/suppliers", suppliersController);
app.use("/products", productsController);
app.use("/sales", salesController);
app.use("/schema", schemaController);
app.use("/actions", actionsController);
app.use("/reports", reportsController);
app.use("/admin", adminController);

app.use("/*splat", (req, res) => {
  const path = req.params.splat;
  const method = req.method;

  return res.status(404).json({
    success: false,
    message: `Route ${method} ${path.join("/")} not found`,
  });
});

app.use(errorHandler);

initDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(`Error initializing database: ${error.message}`);
  });
