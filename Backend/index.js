import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { mongoDBURL } from "./config.js";
import signupRoutes from "./routes/signUp.js";
import signInRoutes from "./routes/signIn.js"
import projectRoutes from "./routes/project.js"
import projectDetails from "./routes/projectDetails.js"
import customerRoutes from "./routes/customer.js";
import Materials from "./routes/Materials/AddMaterials.js"
import FetchMaterials from "./routes/Materials/FetchMaterials.js"
import FetchEmployees from "./routes/AddEmployees.js"

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use Signup Routes
app.use("/signUp", signupRoutes);
app.use("/signin", signInRoutes);
app.use("/api/customer", customerRoutes);
app.use("/projects", projectRoutes);
app.use("/projectDetails", projectDetails);
app.use("/add-materials", Materials);
app.use("/fetch-materials", FetchMaterials);
app.use("/fetch-employees", FetchEmployees);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB
mongoose.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
