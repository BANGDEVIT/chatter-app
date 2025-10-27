import { authRoutes } from "./auth.route.js";
import { messageRoutes } from "./message.route.js";

export const clientRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/messages", messageRoutes);
};
