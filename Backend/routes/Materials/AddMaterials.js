import express from "express"
import materials from "../../models/materials.js";
const router = express.Router();
import MaterialEntry from "../../models/MaterialEntry.js";
import ProjectMaterial from "../../models/ProjectMaterial.js";

router.post("/add", async (req, res) => {
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

router.post('/assign/materials', async (req, res) => {
    const { projectId, MaterialEntry } = req.body;
  
    if (!MaterialEntry || !Array.isArray(MaterialEntry)) {
      return res.status(400).json({ error: "Invalid or missing 'materialsentry'" });
    }
  
    try {
      const assignMat = MaterialEntry.map(mat => ({
        projectId,
        materialId: mat.id,
        quantity: mat.quantity,
        unit: mat.unit,
        unitPrice: mat.unitPrice,
        totalPrice: mat.totalPrice,
        addedtime: mat.addedtime || new Date()
      }));
  
      const saved = await ProjectMaterial.insertMany(assignMat);
      res.status(200).json(saved);
    } catch (error) {
      console.error("Error adding material:", error);
      res.status(500).json({ error: "Error adding material", details: error.message });
    }
  });
  



export default router