import mongoose from "mongoose";

const ProjectMaterialSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'FetchMaterial', required: true },
  quantity: { type: Number, required: true },
  unit: { type: String },
  unitPrice: { type: Number },
  totalPrice: {type:Number},
  addedtime: { type: Date, default: Date.now }
});

export default mongoose.model("ProjectMaterial", ProjectMaterialSchema);

