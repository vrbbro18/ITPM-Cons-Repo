import express from "express"
// import project from "../models/project.js"
import projects from "../models/customer.js"

const router = express.Router()

// router.get('/', async(req,res) =>{
//     try{
//         const projects = await project.find()
//         res.status(200).json(projects);
//     }catch(error){
//         res.status(500).json({ message: "Server error", error });
//     }
// });

router.get('/:id', async(req,res) =>{
    try{
        const project = await projects.findById(req.params.id);
        if (!project)
            return res.status(404).json({ message: "Project not found" });
        res.status(200).json(project);
    }catch(error){
        res.status(500).json({message: "server error",error})
    }
});



export default router