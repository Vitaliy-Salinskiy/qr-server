import { Router } from "express";
import passport from "passport";

import { AuthController } from "../controllers/auth.controller.js";

const route = new Router();
const authController = new AuthController();

const authMiddleware = (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json({ message: info.message });
		}
		req.logIn(user, (err) => {
			if (err) {
				return next(err);
			}
			authController.login(req, res);
		});
	})(req, res, next);
}


route.post("/login", authMiddleware);

export default route;