import { Schema, model } from "mongoose"

/**
 * @swagger
 *  components:
 *   schemas:
 *    Product:
 *     type: object
 *     required:
 *       -name
 *       -price
 *       -image
 *     properties:
 *      _id:
 *       type: string
 *       description: MongoDB unique identifier
 *       example: 65b09a2afd9a1b910c069814
 *      name:
 *       type: string
 *       description: Name of the product
 *       example: "Wood"
 *      price:
 *       type: number
 *       description: Price of the product
 *       example: 19.99
 *      image:
 *       type: string
 *       description: Path of the product's image
 *       example: "uploads/5febb2ad3bb487ed5b1ec5b2829f4541.jpg"
 */

const productSchema = new Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	image: { type: String, required: true },
})

const Product = model("Product", productSchema)

export default Product