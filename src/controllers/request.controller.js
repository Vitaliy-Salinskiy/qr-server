import Request from "../schemas/request.schema.js"
import User from "../schemas/user.schema.js";
import { ProductService } from "../services/product.service.js"

const productService = new ProductService();

export class RequestController {

	addRequest = async (req, res) => {
		try {
			const user = await User.findById(req.params.userId).populate("requests").exec();
			const product = await productService.getProduct(req.params.productId);

			console.log(user);

			if (!user || !product) {
				return res.status(404).json({ message: "User or product not found" });
			}

			const request = await new Request({ userId: user._id, productId: product._id }).save();

			if (user.timesScanned < product.price) {
				return res.status(400).json({ message: "User doesn't have enough points" });
			}

			const isUnique = user.requests.some(request => request.productId.toString() === product._id.toString());

			if (isUnique) {
				return res.status(400).json({ message: "User already requested this product" });
			}

			user.requests.push(request._id);
			user.timesScanned -= product.price;

			await user.save();

			res.status(201).json(request);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

	getRequests = async (req, res) => {
		try {
			const requests = await Request.find();
			res.status(200).json(requests);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

	allowRequest = async (req, res) => {
		try {
			const request = await Request.findById(req.params.id);

			if (!request) {
				return res.status(404).json({ message: "Request not found" });
			}

			const user = await User.findById(request.userId);
			const product = await productService.getProduct(request.productId);

			if (!user || !product) {
				return res.status(404).json({ message: "User or product not found" });
			}

			user.requests = user.requests.filter(requestId => requestId.toString() !== request.id.toString());
			await user.save();

			await Request.findByIdAndDelete(req.params.id);

			res.status(200).json({ message: "Request allowed" });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

	denyRequest = async (req, res) => {
		try {
			const request = await Request.findById(req.params.id);

			if (!request) {
				return res.status(404).json({ message: "Request not found" });
			}

			const user = await User.findById(request.userId);
			const product = await productService.getProduct(request.productId._id);

			if (!user || !product) {
				return res.status(404).json({ message: "User or product not found" });
			}

			user.requests = user.requests.filter(requestId => requestId !== request.id);
			user.timesScanned += product.price;

			await user.save();

			await Request.findByIdAndDelete(req.params.id);

			res.status(200).json({ message: "Request denied" });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}
}