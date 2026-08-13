import { Router } from "express";
import { deleteEggs, updateBreadPrice } from "./action.service.js";

const router = Router();

// Update the price of Bread
router.patch("/update-bread-price", async (req, res) => {
  const price = req.query.price;

  const result = await updateBreadPrice(price);

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(200).json({ success: true, ...result });
});

// Delete the product Eggs
router.delete("/delete-eggs", async (req, res) => {
  const result = await deleteEggs();

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(200).json({ success: true, ...result });
});

export default router;
