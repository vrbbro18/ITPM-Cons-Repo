import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './Styles/EditCustomer.css';
import Sidebar from "../Common/Sidebar";

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    status: "",
    projectName: "",
    budget: "",
    startDate: "",
    endDate: "",
    adminNotes: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/customer/${id}`);
        const data = res.data.data;
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          serviceType: data.serviceType || "",
          status: data.status || "",
          projectName: data.projectName || "",
          budget: data.budget ? String(data.budget) : "", // Convert to string for input
          startDate: data.startDate ? data.startDate.split('T')[0] : "",
          endDate: data.endDate ? data.endDate.split('T')[0] : "",
          adminNotes: data.adminNotes || "",
          message: data.message || "",
        });
      } catch (error) {
        console.error('Error fetching customer:', error);
        alert('Failed to load customer data');
      }
    };
    fetchCustomer();
  }, [id]);

  // Validation rules (all fields required)
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required.";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          error = "Name must contain only letters and spaces.";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address.";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "Phone is required.";
        } else if (!/^\d{10}$/.test(value)) {
          error = "Phone must be exactly 10 digits.";
        }
        break;
      case "serviceType":
        if (!value || value === "") {
          error = "Service type is required.";
        }
        break;
      case "status":
        if (!value || value === "") {
          error = "Status is required.";
        }
        break;
      case "projectName":
        if (!value.trim()) {
          error = "Project name is required.";
        } else if (!/^[A-Za-z0-9\s-]+$/.test(value)) {
          error = "Project name can only contain letters, numbers, spaces, and hyphens.";
        }
        break;
      case "budget":
        if (!value.trim()) {
          error = "Budget is required.";
        } else {
          const budgetNum = Number(value);
          if (isNaN(budgetNum) || budgetNum <= 0 || budgetNum > 100000000) {
            error = "Budget must be a positive number up to 100,000,000.";
          }
        }
        break;
      case "startDate":
        if (!value) {
          error = "Start date is required.";
        } else {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            error = "Invalid start date.";
          } else if (formData.endDate && date > new Date(formData.endDate)) {
            error = "Start date must be before end date.";
          }
        }
        break;
      case "endDate":
        if (!value) {
          error = "End date is required.";
        } else {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            error = "Invalid end date.";
          } else if (formData.startDate && date < new Date(formData.startDate)) {
            error = "End date must be after start date.";
          }
        }
        break;
      case "adminNotes":
        if (!value.trim()) {
          error = "Admin notes are required.";
        } else if (!/^[A-Za-z0-9\s.,!?'-]+$/.test(value)) {
          error = "Admin notes can only contain letters, numbers, spaces, and basic punctuation.";
        }
        break;
      case "message":
        if (!value.trim()) {
          error = "Message is required.";
        } else if (!/^[A-Za-z0-9\s.,!?'-]+$/.test(value)) {
          error = "Message can only contain letters, numbers, spaces, and basic punctuation.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict input based on field type
    if (name === "name" && value && !/^[A-Za-z\s]*$/.test(value)) return;
    if (name === "phone" && value && !/^\d*$/.test(value)) return;
    if (name === "projectName" && value && !/^[A-Za-z0-9\s-]*$/.test(value)) return;
    if (name === "budget" && value && !/^\d*$/.test(value)) return;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate on change
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const handleKeyPress = (e) => {
    const { name } = e.target;
    if (name === "name" && !/[A-Za-z\s]/.test(e.key)) e.preventDefault();
    if (name === "phone" && !/[0-9]/.test(e.key)) e.preventDefault();
    if (name === "projectName" && !/[A-Za-z0-9\s-]/.test(e.key)) e.preventDefault();
    if (name === "budget" && !/[0-9]/.test(e.key)) e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert("Please correct the errors before submitting.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/customer/${id}`, formData);
      navigate('/construction-company-react-app/customerDashboard');
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating customer');
    }
  };

  return (
    <div className="customer-form-container">
      <Sidebar />
      <div className="edit-customer-form">
        <h2>Edit Customer Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name: <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Email: <span className="required">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Phone: <span className="required">*</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              required
              maxLength="10"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
          <div className="form-group">
            <label>Service Type: <span className="required">*</span></label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
            >
              <option value="">Select a service type</option>
              <option value="construction">Construction</option>
              <option value="consulting">Consulting</option>
            </select>
            {errors.serviceType && <span className="error-message">{errors.serviceType}</span>}
          </div>
          <div className="form-group">
            <label>Message: <span className="required">*</span></label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              required
            />
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>
          <div className="form-group">
            <label>Project Name: <span className="required">*</span></label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              required
            />
            {errors.projectName && <span className="error-message">{errors.projectName}</span>}
          </div>
          <div className="form-group">
            <label>Budget: <span className="required">*</span></label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              required
            />
            {errors.budget && <span className="error-message">{errors.budget}</span>}
          </div>
          <div className="form-group">
            <label>Start Date: <span className="required">*</span></label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            {errors.startDate && <span className="error-message">{errors.startDate}</span>}
          </div>
          <div className="form-group">
            <label>End Date: <span className="required">*</span></label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
            {errors.endDate && <span className="error-message">{errors.endDate}</span>}
          </div>
          <div className="form-group">
            <label>Status: <span className="required">*</span></label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select a status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && <span className="error-message">{errors.status}</span>}
          </div>
          <div className="form-group">
            <label>Admin Notes: <span className="required">*</span></label>
            <textarea
              name="adminNotes"
              value={formData.adminNotes}
              onChange={handleChange}
              rows="4"
              required
            />
            {errors.adminNotes && <span className="error-message">{errors.adminNotes}</span>}
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