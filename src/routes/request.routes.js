import { Router } from "express";
import { RequestController } from "../controllers/request.controller.js";

const router = Router();
const requestController = new RequestController();

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Get all requests
 *     tags: [Requests]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to retrieve, defaults to 1 if not provided
 *     responses:
 *       200:
 *         description: A list of requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 requests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 */

router.get("/", requestController.getAllRequests);

/**
 * @swagger
 * /requests/pending:
 *   get:
 *     summary: Get all pending requests
 *     tags: [Requests]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to retrieve, defaults to 1 if not provided
 *     responses:
 *       200:
 *         description: A list of pending requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 totalPendingRequest:
 *                   type: integer
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 requests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 */

router.get("/pending", requestController.getPendingRequests);

/**
 * @swagger
 *  /requests/products/{id}/allow:
 *   post:
 *    tags: [Requests]
 *    summary: Allow request
 *    parameters:
 *     - in: path
 *       name: id
 *       description: MongoDB unique identifier of the request
 *       required: true
 *       schema:
 *        type: string
 *       example: '65b09a2afd9a1b910c069814'
 *    responses:
 *     200:
 *      description: Request allowed
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Request'
 */

router.post("/:id/allow", requestController.allowRequest);

/**
 * @swagger
 *  /requests/{id}/deny:
 *   post:
 *    tags: [Requests]
 *    summary: Deny request
 *    parameters:
 *     - in: path
 *       name: id
 *       description: MongoDB unique identifier of the request
 *       example: '65b09a2afd9a1b910c069814'
 *       required: true
 *       schema:
 *        type: string
 *    responses:
 *     200:
 *      description: Request allowed
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Request'
 */

router.post("/:id/deny", requestController.denyRequest);

/**
 * @swagger
 *  /requests/users/{userId}/{productId}:
 *   post:
 *    tags: [Requests]
 *    summary: Add request
 *    parameters:
 *     - in: path
 *       name: userId
 *       description: MongoDB unique identifier of the user
 *       required: true
 *       schema:
 *        type: string
 *       example: '65b09a2afd9a1b910c069814'
 *     - in: path
 *       name: productId
 *       description: MongoDB unique identifier of the product
 *       required: true
 *       schema:
 *        type: string
 *       example: '65b09a2afd9a1b910c069814'
 *    responses:
 *     200:
 *      description: Request object
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Request'
 */

router.post("/:userId/:productId", requestController.addRequest);

export default router;
