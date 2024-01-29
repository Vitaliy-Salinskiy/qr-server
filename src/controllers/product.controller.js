import Product from "../schemas/product.schema.js";
import { ProductService } from "../services/product.service.js";

const productService = new ProductService();


export class ProductController {

	async getProducts(req, res) {
		try {
			const products = await productService.getProducts()
			res.status(200).json(products);
		} catch (error) {
			res.status(500).json({ message: error.message });
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
			res.status(201).json(product);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

	async deleteProduct(req, res) {
		try {
			const product = await Product.findByIdAndDelete(req.params.id);

			if (!product) {
				return res.status(404).json({ message: "Product not found" });
			}

			res.status(204).json(product);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

}