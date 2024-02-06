import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { body } from "express-validator";
import { validateResultMiddleware } from "../middlewares/index.js";

const router = Router();
const userController = new UserController();

/**
 * @swagger
 *  /users:
 *   get:
 *    tags: [Users]
 *    summary: Get all users
 *    responses:
 *     200:
 *      description: List of users
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/User'
 */

router.get("/", userController.getUsers);

/**
 * @swagger
 *  /users/scans:
 *   get:
 *    tags: [Users]
 *    summary: Get all scans
 *    responses:
 *     200:
 *      description: Number of scans
 *      content:
 *       application/json:
 *        schema:
 *         type: number
 *         description: Total number of scans
 *         example: 121
 */

router.get("/scans", userController.getAllScans);

/**
 * @swagger
 *  /users/{id}:
 *   get:
 *    tags: [Users]
 *    summary: Get user by id
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: string
 *       required: true
 *       description: MongoDB unique identifier of the user
 *       example: '65b09a2afd9a1b910c069814'
 *    responses:
 *      200:
 *       description: User object
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#/components/schemas/User'
 */

router.get("/:id", userController.getUser);

/**
 * @swagger
 *  /users:
 *   post:
 *    tags: [Users]
 *    summary: Create new user
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/User'
 *       example:
 *        name: 'John'
 *        surname: 'Doe'
 *    responses:
 *     200:
 *      description: User object
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/User'
 */

router.post("/", userController.createUser);

/**
 * @swagger
 *  /users/{id}:
 *   put:
 *    tags: [Users]
 *    summary: increase timesScanned by 1 and add it to history
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: string
 *       required: true
 *       description: MongoDB unique identifier of the user
 *       example: '65b09a2afd9a1b910c069814'
 *    responses:
 *     200:
 *      description: User object
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/User'
 */

router.put("/:id", userController.updateUser);

/**
 * @swagger
 *  /users/{id}/credentials:
 *   put:
 *    tags: [Users]
 *    summary: Add credentials (name, surname) to user
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: string
 *       required: true
 *       description: MongoDB unique identifier of the user
 *       example: '65b09a2afd9a1b910c069814'
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         name:
 *          type: string
 *          description: Name of the user
 *          example: 'John'
 *         surname:
 *          type: string
 *          description: Surname of the user
 *          example: 'Doe'
 *    responses:
 *     200:
 *      description: User object
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/User'
 */

router.put(
  "/:id/credentials",
  [
    body("data.name")
      .exists()
      .withMessage("Name is required")
      .isLength({ min: 1 })
      .withMessage("Name must be at least 1 character long"),
    body("data.surname")
      .exists()
      .withMessage("Surname is required")
      .isLength({ min: 1 })
      .withMessage("Surname must be at least 1 character long"),
    validateResultMiddleware,
  ],
  userController.addCredentials
);

/**
 * @swagger
 * /prize/{id}:
 *   put:
 *     summary: Add scans by prize
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prize:
 *                 type: number
 *                 description: The prize value to add to timesScanned
 *     responses:
 *       200:
 *         description: The user was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

router.put("/prize/:id", userController.addScansByPrize);

export default router;
