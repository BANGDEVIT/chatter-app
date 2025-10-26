import express from "express";
import * as controllers from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", controllers.signup);

router.post("/login", controllers.login);

router.post("/logout", controllers.logout);

export const authRoutes = router;
