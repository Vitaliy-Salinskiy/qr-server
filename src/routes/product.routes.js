import { Router } from "express";
import multer from "multer";

import { ProductController } from "../controllers/product.controller.js";

const router = Router();
const productController = new ProductController();

const upload = multer({ dest: "uploads/" })

router.get("/", productController.getProducts);
router.post("/", upload.single("image"), productController.createProduct);

export default router;