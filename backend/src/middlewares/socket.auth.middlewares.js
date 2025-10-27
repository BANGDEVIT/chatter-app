import jwt from "jsonwebtoken";
import User from "../models/Users.model.js"
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // Khi một client kết nối tới server Socket.IO, nó gửi kèm HTTP headers ban đầu (gọi là handshake).
    // cookie: "jwt=abc123; theme=dark; sessionId=xyz789"
    // socket.handshake.headers.cookie : "jwt=abc123; theme=dark; sessionId=xyz789"
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt=")) // Tìm phần tử nào bắt đầu bằng "jwt=", tức là cookie có tên "jwt". Kết quả: "jwt=abc123"
      ?.split("=")[1]; // Tách chuỗi "jwt=abc123" thành ["jwt", "abc123"] Lấy phần tử thứ 2 ([1]) → "abc123"

    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();

    console.log(
      `Socket authenticated for user: ${user.fullName} (${user._id})`
    );

    next();
  } catch (error) {
    console.log("Error in socket authentication:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};
