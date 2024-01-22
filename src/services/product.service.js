import Product from '../schemas/product.schema.js';
import { FileService } from './file.service.js';

const fileService = new FileService();

export class ProductService {

	async getProducts() {
		try {
			return await Product.find();
		} catch (error) {
			throw error;
		}
	}

	async getProduct(id) {
		try {
			const product = await Product.findById(id);
			if (!product) {
				throw new Error('Product not found');
			}
			return product;
		} catch (error) {
			throw error;
		}
	}

	async createProduct(product, image) {
		try {
			if (!image || !product) {
				throw new Error('Please provide an image and product');
			}

			const imageUrl = await fileService.imageToWebp(image);

			return await new Product({ ...product, image: imageUrl }).save();
		} catch (error) {
			throw error;
		}
	}

}