import { Router } from "express";
import {
  addDatabaseUser,
  grantDeletePermission,
  revokeUpdatePermission,
} from "./admin.service.js";

const router = Router();

// Create the database user and grant SELECT, INSERT, UPDATE on all tables
router.post("/db-user", async (req, res) => {
  const username = req.body.username;

  const result = await addDatabaseUser(username);

  return res.status(201).json({ success: true, ...result });
});

// Revoke the UPDATE permission from database user
router.post("/revoke-update", async (req, res) => {
  const username = req.body.username;

  const result = await revokeUpdatePermission(username);

  return res.status(200).json({ success: true, ...result });
});

// Grant DELETE permission to database user only on the Sales table
router.post("/grant-delete-sales", async (req, res) => {
  const username = req.body.username;

  const result = await grantDeletePermission(username);

  return res.status(200).json({ success: true, ...result });
});

export default router;
