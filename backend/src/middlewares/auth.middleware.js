import { ENV } from "../lib/env.js";
import User from "../models/Users.model.js";

export const protectRoute = async (req, res) => {
  try {
    const token = res.cookies.jwt;
    if (!token) {
      res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decode = jwt.veryfy(token, ENV.JWT_SECRET);
    if (!decode) {
      res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const user = await User.findById(decode.userId).select(-password);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in middlewares", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
