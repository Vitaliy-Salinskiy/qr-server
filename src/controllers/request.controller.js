import Request from "../schemas/request.schema.js"
import User from "../schemas/user.schema.js";
import { ProductService } from "../services/product.service.js"

const productService = new ProductService();

export class RequestController {

	addRequest = async (req, res) => {
		try {
			const user = await User.findOne({ id: req.params.userId }).populate("requests").exec();
			const product = await productService.getProduct(req.params.productId);

			if (!user || !product) {
				return res.status(404).json({ message: "User or product not found" });
			}

			if (user.timesScanned < product.price) {
				return res.status(400).json({ message: "User doesn't have enough points" });
			}

			const request = await new Request({ userId: user._id, productId: product._id }).save();

			if (!request) {
				return res.status(500).json({ message: "Error creating request" });
			}

			user.requests.push(request._id);
			user.timesScanned -= product.price;

			await user.save();

			res.status(201).json(request);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

	getPendingRequests = async (req, res) => {
		try {
			const page = parseInt(req.query.page) || 1;
			const limit = 4;

			const skipIndex = (page - 1) * limit;

			const totalRequests = await Request.countDocuments({ status: "pending" });
			const totalPages = Math.ceil(totalRequests / limit)

			const requests = await Request.find({ status: "pending" })
				.populate("userId productId")
				.skip(skipIndex)
				.limit(limit)
				.exec();

			res.status(200).json({
				totalPendingRequest: totalRequests,
				totalPages,
				currentPage: page,
				requests
			});
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

	getAllRequests = async (req, res) => {
		try {
			const page = parseInt(req.query.page) || 1;
			const limit = 4;

			const skipIndex = (page - 1) * limit;

			const totalRequests = await Request.countDocuments();
			const totalPages = Math.ceil(totalRequests / limit)

			const requests = await Request.find()
				.populate("userId productId")
				.skip(skipIndex)
				.limit(limit)
				.exec();

			res.status(200).json({
				totalPages,
				currentPage: page,
				requests
			});
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

			request.status = "allowed";

			await request.save();

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

			request.status = "denied";

			await request.save();

			res.status(200).json({ message: "Request denied" });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}
}