import express from "express"
import project from "../models/customer.js"

const router = express.Router()

router.get('/', async(req,res) =>{
    try{
        const projects = await project.find()
        res.status(200).json(projects);
    }catch(error){
        res.status(500).json({ message: "Server error", error });
    }
});


export default router