import express from "express"
import materials from "../../models/materials.js";
import MaterialEntry from "../../models/MaterialEntry.js";


const router = express.Router();


router.post('/add', async (req, res) => {
    try {
        const { materialId, name, quantity, unit, unitPrice, dateOfPurchase, Remarks } = req.body;

        const material = await materials.findById(materialId)
        if (!material)
            return res.status(404).json({ message: "Material not found" });

        const totalPrice = quantity * material.unitPrice

        const newEntry = new MaterialEntry({ materialId, name, quantity, unit, unitPrice, totalPrice, dateOfPurchase, Remarks })
        await newEntry.save();

        res.status(201).json({ message: "Material entry added", newEntry });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

router.get('/getmat', async (req, res) => {
    try {
        const entries = await MaterialEntry.find().populate("materialId")
        res.json(entries)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
        const material = await MaterialEntry.findByIdAndUpdate(
            id,
            { quantity },   
            { new: true }
        );
        if (!material) {
            return res.status(500).json({ message: "can't" })
        }
        res.json(material)
    } catch (error) {
        console.error("Error updating material:", error);
        res.status(500).json({ message: 'Server error' });
    }
})

export default router;