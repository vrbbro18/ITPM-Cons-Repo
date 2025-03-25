import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  serviceType: { 
    type: String, 
    required: true,
    enum: ['construction', 'consulting']
  },
  message: String,
  projectName: String,
  budget: Number,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  adminNotes: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Customer', customerSchema);