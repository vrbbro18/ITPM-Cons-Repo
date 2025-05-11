import mongoose from "mongoose";

const ProjectEmployeeSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    designation: {type: String},
    assignedDate: { type: Date, default: Date.now }
})

export default mongoose.model("ProjectEmployee", ProjectEmployeeSchema);