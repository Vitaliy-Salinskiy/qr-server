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
			const product = await productService.createProduct(req.body, req.file);
			res.status(201).json(product);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

}