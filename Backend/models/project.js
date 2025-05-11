import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    customerName: { type: String, required: true },
    adminNote: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, default: 'Not Started Yet' },
    email: String,
    contactNo: String,
    serviceType: String,
    message: String,
    budget: String
}, {
    timestamps: true
});

export default mongoose.model("Project", ProjectSchema);
