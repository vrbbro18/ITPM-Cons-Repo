import Customer from "../models/customer.js";

// Create new customer
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, serviceType } = req.body;
    if (!name || !email || !phone || !serviceType) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: name, email, phone, serviceType'
      });
    }

    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    
    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: savedCustomer
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    const { serviceType } = req.query;
    const filter = serviceType ? { serviceType } : {};
    
    const customers = await Customer.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};