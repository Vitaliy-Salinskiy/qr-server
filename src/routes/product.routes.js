import { Router } from "express";
import multer from "multer";

import { ProductController } from "../controllers/product.controller.js";
import { body } from "express-validator";
import { validateResultMiddleware } from "../middlewares/index.js";

const router = Router();
const productController = new ProductController();

const upload = multer({ dest: "uploads/" });

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

router.post(
  "/",
  upload.single("image"),
  [
    body("name")
      .exists()
      .withMessage("Name is required")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
    body("price")
      .exists()
      .withMessage("Price is required")
      .isInt({ min: 1, max: 125 })
      .withMessage("Price must be an integer between 1 and 125"),
    validateResultMiddleware,
  ],
  productController.createProduct
);

/**
 * @swagger
 *  /products/{id}:
 *    delete:
 *      tags: [Products]
 *      summary: Delete a product
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *           type: string
 *           required: true
 *           description: MongoDB unique identifier of the product
 *      responses:
 *        204:
 *          description: The product was deleted successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                example: "Product was deleted successfully"
 */

router.delete("/:id", productController.deleteProduct);

export default router;
