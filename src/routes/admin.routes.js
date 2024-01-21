import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";

const router = Router();
const adminController = new AdminController();

router.get("/:id", adminController.getAdmin);
router.post("/", adminController.createAdmin);

export default router;