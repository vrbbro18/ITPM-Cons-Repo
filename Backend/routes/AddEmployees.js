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



// Routes for employees.js
router.get('/project/:projectId', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        // Find all employees assigned to this project
        const employees = await ProjectEmployee.find({ projectId })
            .populate('employeeId', 'name designation remarks'); // Populate employee details
        
        // Format the response
        const formattedEmployees = employees.map(item => ({
            _id: item._id,
            id: item.employeeId._id,
            name: item.employeeId.name,
            designation: item.designation || item.employeeId.designation,
            remarks: item.employeeId.remarks,
            assignedDate: item.assignedDate
        }));
        
        res.status(200).json(formattedEmployees);
    } catch (error) {
        console.error('Error fetching project employees:', error);
        res.status(500).json({ error: 'Error fetching project employees' });
    }
});

export default router