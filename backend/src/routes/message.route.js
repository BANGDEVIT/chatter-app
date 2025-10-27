import express from "express";
import * as controllers from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/contacts", controllers.getAllContacts);

router.get("/chats", controllers.getChatPartners);

router.get("/:id", controllers.getMessagesByUserId);

router.post("/send/:id", controllers.sendMessage);

export const messageRoutes = router;
