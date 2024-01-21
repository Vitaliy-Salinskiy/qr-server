import { Router } from "express";
import passport from "passport";

import { AuthController } from "../controllers/auth.controller.js";

const route = new Router();
const authController = new AuthController();

route.post("/login", passport.authenticate('local'), authController.login);

export default route;