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
 *      userId:
 *       type: string
 *       description: MongoDB unique identifier of the user
 *      productId:
 *       type: string
 *       description: MongoDB unique identifier of the product
 *      status: 
 *       type: string
 *       enum: [pending, allowed, denied]
 *       default: pending
 *       description: Status of the request
 *      createdAt:
 *       type: string
 *       format: date-time
 *       description: Date of the request creation
 *      updatedAt:
 *       type: string
 *       format: date-time
 *       description: Date of the request update
 */

const requestSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
	status: { type: String, enum: ["pending", "allowed", "denied"], default: "pending" }
}, { timestamps: true })

const Request = model("Request", requestSchema);

export default Request;