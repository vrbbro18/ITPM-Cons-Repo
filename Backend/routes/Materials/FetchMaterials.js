import express from "express"
import materials from "../../models/materials.js";
import MaterialEntry from "../../models/MaterialEntry.js";


const router = express.Router();


router.post('/add', async (req, res) => {
    try {
        const { materialId,name, quantity,unit, dateOfPurchase, Remarks } = req.body;

        const material = await materials.findById(materialId)
        if(!material)
            return res.status(404).json({ message: "Material not found" });

        const totalPrice = quantity * material.unitPrice

        const newEntry = new MaterialEntry({materialId,name,quantity,unit,totalPrice,dateOfPurchase,Remarks})
        await newEntry.save();

        res.status(201).json({ message: "Material entry added", newEntry });
    } catch(error){
        res.status(500).json({ error: error.message });
    }

});

router.get('/', async(req,res) =>{
    try{
        const entries = await MaterialEntry.find().populate("materialId")
        res.json(entries)
    }catch(error){
        res.status(500).json({ error: error.message });
    }
})

export default router;