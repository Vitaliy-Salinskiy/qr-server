import { Router } from "express";
import passport from "passport";

import { AuthController } from "../controllers/auth.controller.js";

const route = new Router();
const authController = new AuthController();

const authMiddleware = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
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
};

/**
 * @swagger
 *  /auth/login:
 *   post:
 *    tags: [Auth]
 *    summary: Login
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Admin'
 *       example:
 *        username: admin
 *        password: admin
 *    responses:
 *     200:
 *      description: Admin object
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Admin'
 */

route.post("/login", authMiddleware);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get admin profile by extracting JWT token from cookies
 *     tags: [Auth]
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: The user profile was retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Unauthorized
 */

route.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => res.json(req.user)
);

export default route;
