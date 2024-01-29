import { Router } from "express";
import { body } from "express-validator";

import { AdminController } from "../controllers/admin.controller.js";
import { validateResultMiddleware } from "../middlewares/index.js";

const router = Router();
const adminController = new AdminController();

/**
 * @swagger
 *  /admins/{id}:
 *   get: 
 *    tags: [Admins]
 *    summary: Get admin by id
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: string
 *       required: true
 *       description: MongoDB unique identifier of the admin
 *       example: '65b09a2afd9a1b910c069814'
 *    responses:
 *     200:
 *      description: Admin object
 *      content:
 *       application/json:
 *        schema: 
 *         $ref: '#/components/schemas/Admin'
 */

router.get("/:id", adminController.getAdmin);

/**
 * @swagger
 *  /admins:
 *   post:
 *    tags: [Admins]
 *    summary: Create admin
 *    requestBody:
 *     required: true
 *     content: 
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Admin'
 *       example:
 *        username: admin
 *        password: admin
 *    responses:
 *     200:
 *      description: Admin object
 *      content: 
 *       application/json:
 *        schema: 
 *         $ref: '#/components/schemas/Admin'
 */

router.post("/",
	[
		body('username')
			.exists()
			.withMessage('Username is required')
			.isLength({ min: 1 })
			.withMessage('Username must be at least 1 character long'),
		body('password')
			.exists()
			.withMessage('Password is required')
			.isLength({ min: 4 })
			.withMessage('Password must be at least 4 characters long'),
		validateResultMiddleware
	],
	adminController.createAdmin
);

export default router;