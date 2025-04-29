import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    designation: { type: String, required: true },
    joinedDate: { type: Date, default: Date.now },
    // status: {
    //     type: String,
    //     enum: ['a', 'in-progress', 'completed'],
    //     default: 'pending'
    // },
    remarks: { type: String }
});


export default mongoose.model("Employees", EmployeeSchema);
