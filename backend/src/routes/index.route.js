import { authRoutes } from "./auth.route.js";

export const clientRoutes = (app) => {
  app.use("/api/auth", authRoutes);
};
