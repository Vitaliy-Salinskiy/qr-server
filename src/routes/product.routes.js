import { Router } from "express";
import multer from "multer";

import { ProductController } from "../controllers/product.controller.js";

const router = Router();
const productController = new ProductController();

const upload = multer({ dest: "uploads/" })

/**
 * @swagger
 *  /products:
 *   get:
 *    tags: [Products]
 *    summary: Get all products
 *    responses:
 *     200:
 *      description: List of products
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/Product'
 */

router.get("/", productController.getProducts);

/**
 * @swagger
 *  /products:
 *   post:
 *    tags: [Products]
 *    summary: Create a new product
 *    requestBody:
 *     required: true
 *     content:
 *      multipart/form-data:
 *       schema:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            description: "Example: Wood"
 *          price:
 *            type: number
 *            description: "Example: 19.99"
 *          image:
 *            type: string
 *            format: binary
 *            description: "Example: Upload your image file here"
 *    responses:
 *     200:
 *      description: Created product
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Product'
 */

router.post("/", upload.single("image"), productController.createProduct);

export default router;