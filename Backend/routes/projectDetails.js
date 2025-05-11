import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new project
router.post('/', async (req, res) => {
  const project = new Project({
    projectName: req.body.projectName,
    customerName: req.body.customerName,
    adminNote: req.body.adminNote,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    status: req.body.status || 'Not Started Yet',
    email: req.body.email || '',
    contactNo: req.body.contactNo || '',
    serviceType: req.body.serviceType || '',
    message: req.body.message || '',
    budget: req.body.budget || ''
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH update a project
router.patch('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    if (req.body.projectName) project.projectName = req.body.projectName;
    if (req.body.customerName) project.customerName = req.body.customerName;
    if (req.body.adminNote) project.adminNote = req.body.adminNote;
    if (req.body.startDate) project.startDate = req.body.startDate;
    if (req.body.endDate) project.endDate = req.body.endDate;
    if (req.body.status) project.status = req.body.status;
    if (req.body.email) project.email = req.body.email;
    if (req.body.contactNo) project.contactNo = req.body.contactNo;
    if (req.body.serviceType) project.serviceType = req.body.serviceType;
    if (req.body.message) project.message = req.body.message;
    if (req.body.budget) project.budget = req.body.budget;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.remove();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;