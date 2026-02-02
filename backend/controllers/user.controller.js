import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// 🧾 Register
export const register = async (req, res) => {
  const { name, email, zone, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, zone, password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        zone: user.zone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔑 Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        zone: user.zone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👤 Get profile (protected)
export const getProfile = async (req, res) => {
  res.json(req.user);
};
