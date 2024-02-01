import Product from "../schemas/product.schema.js";
import Request from "../schemas/request.schema.js";
import User from "../schemas/user.schema.js";
import { FileService } from "../services/file.service.js";
import { ProductService } from "../services/product.service.js";

const productService = new ProductService();
const fileService = new FileService();

export class ProductController {

	async getProducts(req, res) {
		try {
			const products = await productService.getProducts()
			return res.status(200).json(products);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	}

	async createProduct(req, res) {
		try {

			if (!req.file) {
				return res.status(400).json({ message: "Image is required" });
			}

			if (!req.body.name || !req.body.price) {
				return res.status(400).json({ message: "Name and price are required" });
			}

			const product = await productService.createProduct(req.body, req.file);
			return res.status(201).json(product);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	}

	async deleteProduct(req, res) {
		try {
			const product = await Product.findById(req.params.id);

			if (!product) {
				return res.status(404).json({ message: "Product not found" });
			}

			await fileService.deleteFile(product.image);

			const requests = await Request.find({ productId: product._id }).populate('productId userId');
			console.log(requests);

			await Request.deleteMany({ productId: product._id });

			for (let request of requests) {
				if (request.status === 'pending') {
					await User.updateOne(
						{ _id: request.userId._id },
						{
							$pull: { requests: request._id },
							$inc: { timesScanned: request.productId.price }
						}
					);
				}
			};

			await Product.findByIdAndDelete(req.params.id);

			return res.status(204).json("Product was deleted successfully");
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	}

}