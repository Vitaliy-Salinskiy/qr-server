import { validationResult } from "express-validator";

export const validateResultMiddleware = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors });
	}

	next();
}