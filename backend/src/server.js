import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { clientRoutes } from "./routes/index.route.js";

dotenv.config();

const app = express();

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" })); // dùng để gửi req.body và giới hạn gửi lên là 5mb
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

//ClientRoutes
clientRoutes(app);

// make ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
