import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './Styles/EditCustomer.css'; // Adjust path based on your structure
import Sidebar from "../Common/Sidebar";

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "construction",
    status: "pending",
    projectName: "",
    budget: 0,
    startDate: "",
    endDate: "",
    adminNotes: "",
    message: ""
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/customer/${id}`);
        const data = res.data.data;
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          serviceType: data.serviceType,
          status: data.status,
          projectName: data.projectName || "",
          budget: data.budget || 0,
          startDate: data.startDate ? data.startDate.split('T')[0] : '',
          endDate: data.endDate ? data.endDate.split('T')[0] : '',
          adminNotes: data.adminNotes || "",
          message: data.message || ""
        });
      } catch (error) {
        console.error('Error fetching customer:', error);
        alert('Failed to load customer data');
      }
    };
    fetchCustomer();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/customer/${id}`, formData);
      navigate('/construction-company-react-app/customerDashboard');
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating customer');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="customer-form-container">
      <Sidebar />
    <div className="edit-customer-form">
      <h2>Edit Customer Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Service Type:</label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
          >
            <option value="construction">Construction</option>
            <option value="consulting">Consulting</option>
          </select>
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
          />
        </div>
        <div className="form-group">
          <label>Project Name:</label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Budget:</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label>Admin Notes:</label>
          <textarea
            name="adminNotes"
            value={formData.adminNotes}
            onChange={handleChange}
            rows="4"
          />
        </div>
        <button type="submit">Update Customer</button>
        <button 
          type="button" 
          onClick={() => navigate("/construction-company-react-app/customerDashboard")}
        >
          Cancel
        </button>
      </form>
    </div>
    </div>
  );
};

export default EditCustomer;