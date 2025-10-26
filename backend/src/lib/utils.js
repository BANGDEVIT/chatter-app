import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const gernerateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    return res.status(400), json({ message: "WT_SECRET is not configured" });
  }

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "14d" });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks: cross-site scripting
    sameSite: "strict", // CSRF attacks
    secure: ENV.NODE_ENV === "development" ? false : true,
  });

  return token;
};
