import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { PORT, mongoDBURL } from "./config.js";
import signupRoutes from "./routes/signUp.js";
import signInRoutes from "./routes/signIn.js"
// import projectRoutes from "./routes/projects.js"
// import projectDetails from "./routes/projectDetails.js"
import customerRoutes from "./routes/customer.js";


const app = express();
app.use(express.json());
app.use(cors());

// Use Signup Routes
app.use("/signUp", signupRoutes);
app.use("/signin", signInRoutes);
// app.use("/projects", projectRoutes);
// app.use("/projectDetails", projectDetails);
app.use("/api/customer", customerRoutes);


//Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB and start server
mongoose.connect(mongoDBURL)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection error:", error);
    });
