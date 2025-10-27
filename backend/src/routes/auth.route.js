import express from "express";
import * as controllers from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", controllers.signup);

router.post("/login", controllers.login);

router.post("/logout", controllers.logout);

router.post("/profile", protectRoute, controllers.updateProfile);

export const authRoutes = router;
