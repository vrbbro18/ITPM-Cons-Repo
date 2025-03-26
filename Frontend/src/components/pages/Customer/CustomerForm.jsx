import React, { useState } from "react";
import axios from "axios";
import './Styles/CustomerForm.css'; // Adjust path based on your structure
import Sidebar from "../Common/Sidebar";

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "construction",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/customer", formData);
      if (response.data.success) {
        alert("Customer submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          serviceType: "construction",
          message: "",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.response?.data?.message || "Error submitting form");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (  
      <div className="customer-form-container">
      <Sidebar />
    
    <div className="form-container" >
      
      <h2>New Project Request</h2>
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter your phone number"
            pattern="[0-9]{10}"
          />
        </div>

        <div className="form-group">
          <label htmlFor="serviceType">Service Type:</label>
          <select
            id="serviceType"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            className="form-select"
          >
            <option value="construction">Construction</option>
            <option value="consulting">Consulting</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Describe your project requirements"
            rows="4"
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit Request
        </button>
      </form>
    </div>
    </div>
  );
};

export default CustomerForm;