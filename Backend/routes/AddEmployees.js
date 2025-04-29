import express from "express"
import Employees from "../models/Employee.js"
const router = express.Router();

router.get('/employees', async(req,res) =>{
    try{
        const employees = await Employees.find();
        res.json(employees);
    }catch(error){
        res.status(500).json({message:error.message});
    }
})

router.post('/add', async(req,res) =>{
    try{
        const {name, designation,remarks} = req.body;

        const newemployee = new Employees({name,designation,remarks})
        await newemployee.save();

        res.status(200).json({message:"Employee added", employee: newemployee})
    }catch(error){
        res.status(500).json({message:error.message});
    }
})

export default router