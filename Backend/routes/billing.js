const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

// GET all bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find();
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new bill
router.post('/', async (req, res) => {
  const bill = new Bill({
    projectName: req.body.projectName,
    location: req.body.location,
    estimateTime: req.body.estimateTime,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    email: req.body.email,
    address: req.body.address,
    phoneNo1: req.body.phoneNo1,
    phoneNo2: req.body.phoneNo2,
    materials: req.body.materials
  });

  try {
    const newBill = await bill.save();
    res.status(201).json(newBill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH update a bill
router.patch('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    
    if (req.body.projectName) bill.projectName = req.body.projectName;
    if (req.body.location) bill.location = req.body.location;
    if (req.body.estimateTime) bill.estimateTime = req.body.estimateTime;
    if (req.body.startDate) bill.startDate = req.body.startDate;
    if (req.body.endDate) bill.endDate = req.body.endDate;
    if (req.body.email) bill.email = req.body.email;
    if (req.body.address) bill.address = req.body.address;
    if (req.body.phoneNo1) bill.phoneNo1 = req.body.phoneNo1;
    if (req.body.phoneNo2) bill.phoneNo2 = req.body.phoneNo2;
    if (req.body.materials) bill.materials = req.body.materials;

    const updatedBill = await bill.save();
    res.json(updatedBill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a bill
router.delete('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    await bill.remove();
    res.json({ message: 'Bill deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 