import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import "./ProjectServices.css";

export default function ProjectServices() {
  const [projects, setProjects] = useState([
    {
      id: "#01",
      projectName: "Project 1",
      customerName: "John Woods",
      startDate: "2024/11/22",
      endDate: "2025/11/22",
      status: "Not Start Yet",
    },
    {
      id: "#02",
      projectName: "Project 2",
      customerName: "John Woods",
      startDate: "2024/11/22",
      endDate: "2025/11/22",
      status: "Not Start Yet",
    },
    {
      id: "#03",
      projectName: "Project 3",
      customerName: "John Woods",
      startDate: "2024/11/22",
      endDate: "2025/11/22",
      status: "Not Start Yet",
    },
    {
      id: "#04",
      projectName: "Project 4",
      customerName: "John Woods",
      startDate: "2024/11/22",
      endDate: "2025/11/22",
      status: "Not Start Yet",
    },
  ]);

  const [formData, setFormData] = useState({
    projectName: "",
    customerName: "",
    adminNote: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({
    projectName: "",
    customerName: "",
    startDate: "",
    endDate: "",
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [editingProject, setEditingProject] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    projectName: "",
    customerName: "",
    email: "",
    contactNo: "",
    serviceType: "",
    message: "",
    adminNote: "",
    budget: "",
    startDate: "",
    endDate: "",
  });

  const [editFormErrors, setEditFormErrors] = useState({
    projectName: "",
    customerName: "",
    email: "",
    contactNo: "",
    serviceType: "",
    message: "",
    adminNote: "",
    budget: "",
    startDate: "",
    endDate: "",
  });

  const [showUpdateSuccessMessage, setShowUpdateSuccessMessage] =
    useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingProject, setViewingProject] = useState(null);
  const [viewFormData, setViewFormData] = useState({
    projectName: "",
    customerName: "",
    email: "",
    contactNo: "",
    serviceType: "",
    message: "",
    adminNote: "",
    budget: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  const validateDate = (date, fieldName) => {
    if (!date) return `${fieldName} is required`;

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return `${fieldName} cannot be in the past`;
    }
    return "";
  };

  const validateField = (name, value) => {
    switch (name) {
      case "projectName":
        return !value ? "Project Name is required" : "";
      case "customerName":
        return !value ? "Customer Name is required" : "";
      case "startDate":
        return validateDate(value, "Start Date");
      case "endDate":
        return validateDate(value, "End Date");
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field on change
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      projectName: validateField("projectName", formData.projectName),
      customerName: validateField("customerName", formData.customerName),
      startDate: validateField("startDate", formData.startDate),
      endDate: validateField("endDate", formData.endDate),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleAddProject = () => {
    if (!validateForm()) {
      return;
    }

    const newProject = {
      id: `#${String(projects.length + 1).padStart(2, "0")}`,
      projectName: formData.projectName,
      customerName: formData.customerName,
      adminNote: formData.adminNote,
      startDate: formatDate(formData.startDate),
      endDate: formatDate(formData.endDate),
      status: "Not Started Yet",
      email: "",
      contactNo: "",
      serviceType: "",
      message: "",
      budget: "",
    };

    setProjects((prev) => [...prev, newProject]);
    setFormData({
      projectName: "",
      customerName: "",
      adminNote: "",
      startDate: "",
      endDate: "",
    });
    setErrors({
      projectName: "",
      customerName: "",
      startDate: "",
      endDate: "",
    });

    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000); // Hide message after 3 seconds
  };

  const handleStatusChange = (projectId, newStatus) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, status: newStatus } : project
      )
    );
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setEditFormData({
      projectName: project.projectName,
      customerName: project.customerName,
      email: project.email || "",
      contactNo: project.contactNo || "",
      serviceType: project.serviceType || "",
      message: project.message || "",
      adminNote: project.adminNote || "",
      budget: project.budget || "",
      startDate: project.startDate,
      endDate: project.endDate,
    });
    setShowEditModal(true);
  };

  const validateEditField = (name, value) => {
    switch (name) {
      case "projectName":
        return !value ? "Project Name is required" : "";
      case "customerName":
        return !value ? "Customer Name is required" : "";
      case "email":
        if (!value) return "Email is required";
        if (!value.includes("@")) return 'Include "@" in the email';
        return "";
      case "contactNo":
        if (!value) return "Contact No is required";
        if (!/^\d{10}$/.test(value.replace(/\D/g, ""))) return "Invalid number";
        return "";
      case "serviceType":
        return !value ? "Service Type is required" : "";
      case "message":
        return !value ? "Message is required" : "";
      case "adminNote":
        return !value ? "Admin Note is required" : "";
      case "budget":
        return !value ? "Budget is required" : "";
      case "startDate":
        return validateDate(value, "Start Date");
      case "endDate":
        return validateDate(value, "End Date");
      default:
        return "";
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field on change
    const error = validateEditField(name, value);
    setEditFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateEditForm = () => {
    const newErrors = {};
    Object.keys(editFormData).forEach((key) => {
      newErrors[key] = validateEditField(key, editFormData[key]);
    });
    setEditFormErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleUpdateProject = () => {
    if (!validateEditForm()) {
      return;
    }

    setProjects((prev) =>
      prev.map((project) =>
        project.id === editingProject.id
          ? {
              ...project,
              projectName: editFormData.projectName,
              customerName: editFormData.customerName,
              email: editFormData.email,
              contactNo: editFormData.contactNo,
              serviceType: editFormData.serviceType,
              message: editFormData.message,
              adminNote: editFormData.adminNote,
              budget: editFormData.budget,
              startDate: formatDate(editFormData.startDate),
              endDate: formatDate(editFormData.endDate),
            }
          : project
      )
    );

    // Show success message
    setShowUpdateSuccessMessage(true);
    setTimeout(() => {
      setShowUpdateSuccessMessage(false);
    }, 3000);

    setShowEditModal(false);
    setEditingProject(null);
    setEditFormErrors({
      projectName: "",
      customerName: "",
      email: "",
      contactNo: "",
      serviceType: "",
      message: "",
      adminNote: "",
      budget: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleViewClick = (project) => {
    setViewingProject(project);
    setViewFormData({
      projectName: project.projectName || "Not provided",
      customerName: project.customerName || "Not provided",
      adminNote: project.adminNote || "Not provided",
      email: project.email || "Not provided",
      contactNo: project.contactNo || "Not provided",
      serviceType: project.serviceType || "Not provided",
      message: project.message || "Not provided",
      budget: project.budget || "Not provided",
      startDate: project.startDate || "Not provided",
      endDate: project.endDate || "Not provided",
      status: project.status || "Not Started Yet",
    });
    setShowViewModal(true);
  };

  return (
    <div className="project-container">
      {/* Page Title */}
      <div className="page-title">
        <h1>Project Services</h1>
      </div>

      {/* Success Message Popup */}
      {showSuccessMessage && (
        <div className="success-message">
          <div className="success-message-content">
            <svg
              className="success-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-800 font-medium">
              Project Successfully Added
            </span>
          </div>
        </div>
      )}

      {/* Update Success Message Popup */}
      {showUpdateSuccessMessage && (
        <div className="success-message">
          <div className="success-message-content">
            <svg
              className="success-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-800 font-medium">
              Project Successfully Updated
            </span>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Project Details</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="close-button"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="modal-grid">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={editFormData.projectName}
                  onChange={handleEditFormChange}
                  className={`w-full px-3 py-2 border ${
                    editFormErrors.projectName
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {editFormErrors.projectName && (
                  <p className="mt-1 text-sm text-red-600">
                    {editFormErrors.projectName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={editFormData.customerName}
                  onChange={handleEditFormChange}
                  className={`w-full px-3 py-2 border ${
                    editFormErrors.customerName
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {editFormErrors.customerName && (
                  <p className="mt-1 text-sm text-red-600">
                    {editFormErrors.customerName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={editFormData.startDate}
                  onChange={handleEditFormChange}
                  className={`w-full px-3 py-2 border ${
                    editFormErrors.startDate
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {editFormErrors.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {editFormErrors.startDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={editFormData.endDate}
                  onChange={handleEditFormChange}
                  className={`w-full px-3 py-2 border ${
                    editFormErrors.endDate
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {editFormErrors.endDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {editFormErrors.endDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  className={`w-full px-3 py-2 border ${
                    editFormErrors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                />
                {editFormErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {editFormErrors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact No
                </label>
                <input
                  type="tel"
                  name="contactNo"
                  value={editFormData.contactNo}
                  onChange={handleEditFormChange}
                  className={`w-full px-3 py-2 border ${
                    editFormErrors.contactNo
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {editFormErrors.contactNo && (
                  <p className="mt-1 text-sm text-red-600">
                    {editFormErrors.contactNo}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <input
                  type="text"
                  name="serviceType"
                  value={editFormData.serviceType}
                  onChange={handleEditFormChange}
                  className={`w-full px-3 py-2 border ${
                    editFormErrors.serviceType
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {editFormErrors.serviceType && (
                  <p className="mt-1 text-sm text-red-600">
                    {editFormErrors.serviceType}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <input
                  type="text"
                  name="message"
                  value={editFormData.message}
                  onChange={handleEditFormChange}
                  className={`w-full px-3 py-2 border ${
                    editFormErrors.message
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {editFormErrors.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {editFormErrors.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Note
                </label>
                <input
                  type="text"
                  name="adminNote"
                  value={editFormData.adminNote}
                  onChange={handleEditFormChange}
                  className={`w-full px-3 py-2 border ${
                    editFormErrors.adminNote
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {editFormErrors.adminNote && (
                  <p className="mt-1 text-sm text-red-600">
                    {editFormErrors.adminNote}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget
                </label>
                <input
                  type="text"
                  name="budget"
                  value={editFormData.budget}
                  onChange={handleEditFormChange}
                  className={`w-full px-3 py-2 border ${
                    editFormErrors.budget ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                />
                {editFormErrors.budget && (
                  <p className="mt-1 text-sm text-red-600">
                    {editFormErrors.budget}
                  </p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowEditModal(false)}
                className="modal-button cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProject}
                className="modal-button update-button"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Project Modal */}
      {showViewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Project Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="close-button"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="modal-grid">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project ID
                </label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {viewingProject?.id || "Not provided"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Status
                </label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {viewingProject?.status || "Not Started Yet"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {viewFormData.projectName}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {viewFormData.customerName}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Note
                </label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {viewFormData.adminNote}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {viewFormData.startDate}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {viewFormData.endDate}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {viewFormData.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact No
                </label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {viewFormData.contactNo}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {viewFormData.serviceType}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {viewFormData.message}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget
                </label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {viewFormData.budget}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowViewModal(false)}
                className="modal-button cancel-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="add-projects-container">
        <div className="form-section">
          <h2 className="section-title">Add Projects</h2>
          <div className="form-grid">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <select
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.projectName ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-primary focus:border-primary`}
              >
                <option value="">Select Project</option>
                <option value="Project A">Project A</option>
                <option value="Project B">Project B</option>
                <option value="Project C">Project C</option>
              </select>
              {errors.projectName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.projectName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.customerName ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.customerName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Note
              </label>
              <input
                type="text"
                name="adminNote"
                value={formData.adminNote}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                placeholder="Add note"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-primary focus:border-primary`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-primary focus:border-primary`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
            <div className="flex items-end">
              <button onClick={handleAddProject} className="add-button">
                ADD PROJECT
              </button>
            </div>
          </div>

          {/* Projects Table */}
          <div className="projects-table-container overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200 p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 ">
              Projects
            </h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-pink-100">
                <tr>
                  {[
                    "Project ID",
                    "Project Name",
                    "Customer Name",
                    "Start Date",
                    "End Date",
                    "Status",
                    "Action",
                  ].map((title) => (
                    <th
                      key={title}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-pink-50 transition">
                    <td className="px-4 py-1 text-sm text-gray-700">
                      {project.id}
                    </td>
                    <td className="px-4 py-1 text-sm text-gray-700">
                      {project.projectName}
                    </td>
                    <td className="px-4 py-1 text-sm text-gray-700">
                      {project.customerName}
                    </td>
                    <td className="px-4 py-1 text-sm text-gray-700">
                      {project.startDate}
                    </td>
                    <td className="px-4 py-1 text-sm text-gray-700">
                      {project.endDate}
                    </td>
                    <td className="px-4 py-1 text-sm text-gray-700">
                      <select
                        className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:ring-2 focus:ring-primary focus:border-primary"
                        value={project.status}
                        onChange={(e) =>
                          handleStatusChange(project.id, e.target.value)
                        }
                      >
                        <option value="Not Started Yet">Not Started Yet</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-4 py-1 text-sm text-gray-700">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewClick(project)}
                          className="hover:bg-gray-100 p-0 rounded-full"
                          title="View"
                        >
                          <VisibilityIcon
                            fontSize="small"
                            className="text-gray-600"
                          />
                        </button>
                        <button
                          onClick={() => handleEditClick(project)}
                          className="hover:bg-gray-100 p-0 rounded-full"
                          title="Edit"
                        >
                          <EditIcon
                            fontSize="small"
                            className="text-gray-600"
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="hover:bg-gray-100 p-0 rounded-full"
                          title="Delete"
                        >
                          <DeleteIcon
                            fontSize="small"
                            className="text-gray-600"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}