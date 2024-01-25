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
 *      name:
 *       type: string
 *       description: Name of the product
 *      price:
 *       type: number
 *       description: Price of the product
 *      image:
 *       type: string
 *       description: Path of the product's image
 */

const productSchema = new Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	image: { type: String, required: true },
})

const Product = model("Product", productSchema)

export default Product