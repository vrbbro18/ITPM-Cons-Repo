import express from "express"
import Employees from "../models/Employee.js"
import ProjectEmployee from "../models/ProjectEmployee.js"
const router = express.Router();

router.get('/employees', async (req, res) => {
    try {
        const employees = await Employees.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.post('/add', async (req, res) => {
    try {
        const { name, designation, remarks } = req.body;

        const newemployee = new Employees({ name, designation, remarks })
        await newemployee.save();

        res.status(200).json({ message: "Employee added", employee: newemployee })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/assign/employees', async (req, res) => {
    const { projectId, employees } = req.body;
    try {
        const assignemp = employees.map(emp => ({
            projectId,
            employeeId: emp.id,
            designation: emp.designation,
            assignedDate: emp.assignedDate || new Date()
        }));
        const saved = await ProjectEmployee.insertMany(assignemp);
        res.status(200).json(saved);
    }catch(error){
        res.status(500).json({error:"Error adding Employee"})
    }
});

export default router