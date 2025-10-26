import { gernerateToken } from "../lib/utils.js";
import User from "../models/Users.model.js";
import bcrypt from "bcryptjs";

//[POST] /api/auth/signup
export const signup = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    if (!email.trim() || !password.trim() || !fullName.trim()) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length.trim() < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({
      email: email,
    });

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email,
      fullName: fullName,
      hashedPassword: hashedPassword,
    });

    if (newUser) {
      const savedUser = await newUser();
      gernerateToken(savedUser._id, res);
      res.sendStatus(204);
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller : ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//[POST] /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email.trim() || !password.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    gernerateToken(user_id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//[POST] /api/auth/logout
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
