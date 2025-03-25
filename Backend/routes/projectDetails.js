// import express from "express"
// import project from "../models/project.js"

// const router = express.Router()

// // router.get('/', async(req,res) =>{
// //     try{
// //         const projects = await project.find()
// //         res.status(200).json(projects);
// //     }catch(error){
// //         res.status(500).json({ message: "Server error", error });
// //     }
// // });

// router.get('/:id', async(req,res) =>{
//     try{
//         const projects = await project.findById(req.params.id);
//         if (!projects)
//             return res.status(404).json({ message: "Project not found" });
//         res.status(200).json(projects);
//     }catch(error){
//         res.status(500).json({message: "server error",error})
//     }
// });

// export default router