import express from "express"
import materials from "../../models/materials.js";
const router = express.Router();

router.post("/add", async(req,res) =>{
    try {
        const { name, unit, unitPrice } = req.body;

        // Check if material already exists
        const existingMaterial = await materials.findOne({ name });
        if (existingMaterial) {
            return res.status(400).json({ message: "Material already exists" });
        }

        const newMaterial = new materials({ name, unit, unitPrice });
        await newMaterial.save();

        res.status(201).json({ message: "Material added successfully", material: newMaterial });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get('/', async (req, res, next) => {
    try {
        const material = await materials.find()
        res.json(material)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



export default router