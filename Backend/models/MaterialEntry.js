import mongoose from "mongoose";

const MaterialEntrySchema  = new mongoose.Schema({
    materialId: { type: mongoose.Schema.Types.ObjectId, ref:"Materials", required: true},
    // name: {type:}
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    dateOfPurchase: {type:Date, default: Date.now},
    addedtime: { type: Date, default: Date.now },
    Remarks: {type: String}
});

export default mongoose.model("FetchMaterial", MaterialEntrySchema);
