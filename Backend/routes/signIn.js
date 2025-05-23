import express from "express";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Signin Route
router.post("/", async (req, res) => {
    
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
       
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful"});
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;
