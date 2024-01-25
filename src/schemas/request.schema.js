import { Schema, model } from "mongoose";

/**
 * @swagger
 *  components:
 *   schemas:
 *    Request:
 *     type: object
 *     required:
 *      - userId
 *      - productId
 *     properties:
 *      _id: 
 *       type: string
 *       description: MongoDB unique identifier
 *       example: 65b09a2afd9a1b910c069814
 *      userId:
 *       type: string
 *       description: MongoDB unique identifier of the user
 *       example: 9c46814aaf58f43eb1ad1bbc94c63e81
 *      productId:
 *       type: string
 *       description: MongoDB unique identifier of the product
 *       example: 9c46814aaf58f43eb1ad1bbc94c63e81
 *      status: 
 *       type: string
 *       enum: [pending, allowed, denied]
 *       default: pending
 *       description: Status of the request
 *       example: pending
 *      createdAt:
 *       type: string
 *       format: date-time
 *       description: Date of the request creation
 *       example: 2024-01-24T05:04:12.755+00:00
 *      updatedAt:
 *       type: string
 *       format: date-time
 *       description: Date of the request update
 *       example: 2024-01-24T05:05:12.755+00:00
 */

const requestSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
	status: { type: String, enum: ["pending", "allowed", "denied"], default: "pending" }
}, { timestamps: true })

const Request = model("Request", requestSchema);

export default Request;