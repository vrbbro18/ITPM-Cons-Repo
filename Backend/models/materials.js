import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    unit: { type: String, required: true },
    unitPrice: { type: Number, required: true },
});


export default mongoose.model("Materials", MaterialSchema);
