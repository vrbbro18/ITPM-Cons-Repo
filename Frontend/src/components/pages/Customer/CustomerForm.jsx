import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../Common/Sidebar"; // Adjust path based on your structure
import './Styles/CustomerForm.css'; // Adjust path based on your structure
import photo1 from '../../../assets/img/photo1.jpg'; // Adjust path to your image file

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  // Validation rules
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!/^[A-Za-z\s]+$/.test(value)) {
          error = "Name must contain only letters and spaces.";
        } else if (value.trim().length === 0) {
          error = "Name is required.";
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address.";
        }
        break;
      case "phone":
        if (!/^\d{10}$/.test(value)) {
          error = "Phone must be exactly 10 digits (no letters, spaces, or special characters).";
        }
        break;
      case "serviceType":
        if (!value || value === "") {
          error = "Please select a service type.";
        }
        break;
      case "message":
        if (value.trim().length === 0) {
          error = "Message is required.";
        } else if (!/^[A-Za-z0-9\s.,!?'-]+$/.test(value)) {
          error = "Message can only contain letters, numbers, spaces, and basic punctuation (.,!?'()-).";
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
    if (name === "name" && value && !/^[A-Za-z\s]*$/.test(value)) {
      return; // Prevent typing non-letters
    }
    if (name === "phone" && value && !/^\d*$/.test(value)) {
      return; // Prevent typing non-digits
    }

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
    if (name === "name" && !/[A-Za-z\s]/.test(e.key)) {
      e.preventDefault(); // Block non-letter keys
    }
    if (name === "phone" && !/[0-9]/.test(e.key)) {
      e.preventDefault(); // Block non-digit keys
    }
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

    // If there are errors, prevent submission
    if (Object.keys(newErrors).length > 0) {
      return;
    }

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
        setErrors({});
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.response?.data?.message || "Error submitting form");
    }
  };

  return (
    <div className="customer-form-container">
      <Sidebar />
     <div className="content-wrapper">
             <div className="container">
               <div className="row align-items-center">
                 {/* Left Column: Image */}
                 <div className="col-12 col-md-6 mb-4 mb-md-0">
                   <img
                     src={photo1}
                     alt="Project Visual"
                     className="img-fluid form-image"
                   />
                 </div>
     
                 {/* Right Column: Form */}
                 <div className="col-12 col-md-6">
                   <div className="form-container">
                     <h2 className="text-center mb-4">New Project Request</h2>
                     <form onSubmit={handleSubmit} className="project-form bg-light p-4">
                       <div className="row g-3">
                         {/* Name */}
                         <div className="col-12 col-sm-6">
                           <label htmlFor="name" className="form-label">Full Name:</label>
                           <input
                             type="text"
                             id="name"
                             name="name"
                             value={formData.name}
                             onChange={handleChange}
                             onKeyPress={handleKeyPress}
                             required
                             className="form-control border-0"
                             placeholder="Enter your full name"
                             style={{ height: "45px" }} // Reduced height
                           />
                           {errors.name && <span className="error-message">{errors.name}</span>}
                         </div>
     
                         {/* Email */}
                         <div className="col-12 col-sm-6">
                           <label htmlFor="email" className="form-label">Email:</label>
                           <input
                             type="email"
                             id="email"
                             name="email"
                             value={formData.email}
                             onChange={handleChange}
                             required
                             className="form-control border-0"
                             placeholder="Enter your email"
                             style={{ height: "45px" }} // Reduced height
                           />
                           {errors.email && <span className="error-message">{errors.email}</span>}
                         </div>
     
                         {/* Phone */}
                         <div className="col-12 col-sm-6">
                           <label htmlFor="phone" className="form-label">Phone Number:</label>
                           <input
                             type="tel"
                             id="phone"
                             name="phone"
                             value={formData.phone}
                             onChange={handleChange}
                             onKeyPress={handleKeyPress}
                             required
                             maxLength="10"
                             className="form-control border-0"
                             placeholder="Enter your phone number"
                             style={{ height: "45px" }} // Reduced height
                           />
                           {errors.phone && <span className="error-message">{errors.phone}</span>}
                         </div>
     
                         {/* Service Type */}
                         <div className="col-12 col-sm-6">
                           <label htmlFor="serviceType" className="form-label">Service Type:</label>
                           <select
                             id="serviceType"
                             name="serviceType"
                             value={formData.serviceType}
                             onChange={handleChange}
                             required
                             className="form-control border-0"
                             style={{ height: "45px" }} // Reduced height
                           >
                             <option value="">Select a service type</option>
                             <option value="construction">Construction</option>
                             <option value="consulting">Consulting</option>
                           </select>
                           {errors.serviceType && <span className="error-message">{errors.serviceType}</span>}
                         </div>
     
                         {/* Message */}
                         <div className="col-12">
                           <label htmlFor="message" className="form-label">Message:</label>
                           <textarea
                             id="message"
                             name="message"
                             value={formData.message}
                             onChange={handleChange}
                             required
                             className="form-control border-0"
                             placeholder="Describe your project requirements"
                             rows="3" // Reduced rows
                             style={{ height: "100px" }} // Reduced height
                           />
                           {errors.message && <span className="error-message">{errors.message}</span>}
                         </div>
     
                         {/* Submit Button */}
                         <div className="col-12">
                           <button type="submit" className="btn btn-primary w-100 py-2">
                             Submit Request
                           </button>
                         </div>
                       </div>
                     </form>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        
         </div>
       );
     };
export default CustomerForm;