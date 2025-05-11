import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUser, FaBuilding, FaEdit, FaTrash, FaInfoCircle, FaTools, FaUsers, FaCalendarAlt, FaEye } from "react-icons/fa";
import "../project/projectList.css";

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [availableMaterials, setAvailableMaterials] = useState([]);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [assignedMaterials, setAssignedMaterials] = useState([]);
    const [materialQuantities, setMaterialQuantities] = useState({});
    const [activePopup, setActivePopup] = useState(null);
    const [assignedEmployees, setAssignedEmployees] = useState([]);
    const [assignedDateRange, setAssignedDateRange] = useState({ start: '', end: '' });
    const [selectedEmployees, setSelectedEmployees] = useState({});
    const [editMaterial, setEditMaterial] = useState(null);
    const [editEmployee, setEditEmployee] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        loadProject();
        loadAvailableMaterials();
        loadAvailableEmployees();
    }, []);

    const loadProject = async () => {
        try {
            const response = await fetch(`http://localhost:5000/projectDetails/${id}`);
            const data = await response.json();
            setProject(data);
            setAssignedMaterials(data.assignedMaterials || []);
            setAssignedEmployees(data.assignedEmployees || []);
            setAssignedDateRange(data.dateRange || { start: '', end: '' });
        } catch (error) {
            console.error("Error fetching project:", error);
        }
    };

    const loadAvailableMaterials = async () => {
        try {
            const response = await fetch("http://localhost:5000/fetch-materials/getmat");
            const data = await response.json();
            setAvailableMaterials(data);
        } catch (error) {
            console.error("Error fetching materials:", error);
        }
    };

    const loadAvailableEmployees = async () => {
        try {
            const res = await fetch("http://localhost:5000/fetch-employees/employees");
            const data = await res.json();
            setAvailableEmployees(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const handleQuantityChange = (materialId, quantity) => {
        setMaterialQuantities((prev) => ({
            ...prev,
            [materialId]: quantity,
        }));
    };

    const handleEmployeeChange = (employeeId) => {
        setSelectedEmployees((prev) => ({
            ...prev,
            [employeeId]: !prev[employeeId]
        }));
    };

    const saveAllAssignments = async () => {
        if (!project?._id) {
            alert("Project not loaded yet!");
            return;
        }

        try {
            // Save Employees
            if (assignedEmployees.length > 0) {
                const employeePayload = {
                    projectId: project._id,
                    employees: assignedEmployees.map(emp => ({
                        id: emp._id,
                        designation: emp.designation,
                        assignedDate: emp.assignedDate
                    }))
                };

                const empResponse = await fetch("http://localhost:5000/fetch-employees/assign/employees", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(employeePayload)
                });

                if (!empResponse.ok) throw new Error("Failed to save employees");
            }

            // Save Materials
            if (assignedMaterials.length > 0) {
                console.log("projectId", project._id)

                const materialPayload = {
                    projectId: project._id,

                    MaterialEntry: assignedMaterials.map(mat => ({

                        id: mat._id || mat.id,
                        quantity: mat.quantity,
                        unit: mat.unit,
                        unitPrice: mat.unitPrice,
                        totalPrice: mat.totalPrice,
                        assignedDate: mat.assignedDate
                    }))
                };
                const matResponse = await fetch("http://localhost:5000/add-materials/assign/materials", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(materialPayload)
                });

                if (!matResponse.ok) throw new Error("Failed to save materials");
            }

            alert("Assignments saved successfully!");
            setSaveSuccess(true);
        } catch (err) {
            console.error("Error saving assignments:", err);
            alert("Failed to save assignments.");
        }
    };

    const viewProject = () => {
        // Correct path based on the route you defined
        window.open(`/construction-company-react-app/projectDetails/${id}`, '_blank');
    };
    

    const assignEmployees = () => {
        const selectedEmpList = availableEmployees.filter(emp => selectedEmployees[emp._id]);
        if (selectedEmpList.length === 0) {
            alert("Please select at least one employee");
            return;
        }

        // Add assignment date to each employee
        const employeesWithDate = selectedEmpList.map(emp => ({
            ...emp,
            assignedDate: new Date().toISOString()
        }));

        setAssignedEmployees((prev) => [...prev, ...employeesWithDate]);

        setAvailableEmployees((prev) =>
            prev.filter((emp) => !selectedEmployees[emp._id])
        );

        setSelectedEmployees({});
        closePopup();
    };

    const assignMaterial = (materialId) => {
        const selectedMaterial = availableMaterials.find((mat) => mat._id === materialId);
        const assignQuantity = parseInt(materialQuantities[materialId]);

        if (!selectedMaterial || isNaN(assignQuantity) || assignQuantity <= 0 || assignQuantity > selectedMaterial.quantity) {
            alert("Invalid quantity! Please enter a valid number.");
            return;
        }

        setAssignedMaterials((prevAssigned) => {
            const existingIndex = prevAssigned.findIndex((mat) => mat._id === materialId);

            if (existingIndex !== -1) {
                return prevAssigned.map((mat, index) =>
                    index === existingIndex
                        ? { ...mat, quantity: mat.quantity + assignQuantity }
                        : mat
                );
            } else {
                return [...prevAssigned, {
                    id: materialId,
                    name: selectedMaterial.name,
                    quantity: assignQuantity,
                    unit: selectedMaterial.unit,
                    unitPrice: selectedMaterial.unitPrice,
                    assignedDate: new Date().toISOString()
                }];
            }
        });

        setAvailableMaterials((prevAvailable) =>
            prevAvailable.map((mat) =>
                mat._id === materialId ? { ...mat, quantity: mat.quantity - assignQuantity } : mat
            )
        );

        setMaterialQuantities((prev) => ({ ...prev, [materialId]: "" }));
    };

    const saveEditMaterials = async () => {
        try {
            console.log("Editing Material ID:", editMaterial.id);
            const response = await fetch(`http://localhost:5000/fetch-materials/${editMaterial._id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    quantity: editMaterial.quantity,
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update')
            }
            const updatedMaterial = await response.json();
            setAssignedMaterials((prev) =>
                prev.map((mat) => (mat._id === updatedMaterial._id ? updatedMaterial : mat))
            );
            setEditMaterial(null);
        } catch (error) {
            console.error("Error updating material:", error)
        }
    }

    const openPopup = (popupType) => {
        setActivePopup(popupType);
    };

    const closePopup = () => {
        setActivePopup(null);
    };

    const openEditMaterial = (material) => {
        setEditMaterial(material)
    }

    const openEditEmployees = (employee) => {
        setEditEmployee(employee)
    }

    return (
        <div>
            <aside className="sidebar">
                <h2 className="sidebar-title">Project & Services</h2>
                <nav>
                    <ul className="sidebar-menu">
                        <li><a href="/construction-company-react-app/ProjectDashboard">🏠 Home</a></li>
                        <li><a href="/construction-company-react-app/projects">🏗 Construction</a></li>
                        <li><a href="/construction-company-react-app/MaterialForm">🔧 Consulting & Services</a></li>
                        <li><a href="/construction-company-react-app/MaterialForm">📊 Reports & Analytics</a></li>
                        <li><a href="/construction-company-react-app/generateSketch">📊 sketch & Analytics</a></li>
                    </ul>
                </nav>
                
            </aside>

            <div className="project-details-container">
                <h2 className="title">Project Details</h2>

                {project ? (
                    <div className="project-info-card">
                        <div className="info-item">
                            <FaBuilding className="icon building" />
                            <p><strong>Client Name:</strong> {project.name}</p>
                        </div>

                        <div className="info-item">
                            <FaUser className="icon user" />
                            <p><strong>Project Name:</strong> {project.projectName}</p>
                        </div>

                        <div className="info-item">
                            <FaInfoCircle className="icon status" />
                            <p><strong>Status:</strong> {project.status}</p>
                        </div>
                    </div>
                ) : (
                    <p>Loading project details...</p>
                )}

                

                {/* Assignment Categories */}
                <h3 className="section-title">Manage Project Resources</h3>
                <div className="assignment-categories">
                    <div className="category-card" onClick={() => openPopup('materials')}>
                        <FaTools className="category-icon" />
                        <h4>Materials</h4>
                        <p>{assignedMaterials.length} items assigned</p>
                    </div>

                    <div className="category-card" onClick={() => openPopup('employees')}>
                        <FaUsers className="category-icon" />
                        <h4>Employees</h4>
                        <p>{assignedEmployees.length} employees assigned</p>
                    </div>

                    <div className="category-card" onClick={() => openPopup('daterange')}>
                        <FaCalendarAlt className="category-icon" />
                        <h4>Project Timeline</h4>
                        <p>{assignedDateRange.start ? `${new Date(assignedDateRange.start).toLocaleDateString()} - ${new Date(assignedDateRange.end).toLocaleDateString()}` : 'Not set'}</p>
                    </div>
                </div>

                {/* Assignment Summary Tables */}
                <div className="assignment-summaries">
                    <div className="summary-section">
                        <h3 className="section-title">Assigned Materials</h3>
                        {assignedMaterials.length > 0 ? (
                            <table className="summary-table">
                                <thead>
                                    <tr>
                                        <th>Material</th>
                                        <th>Quantity</th>
                                        <th>Unit</th>
                                        <th>Unit Price</th>
                                        <th>Total Price</th>
                                        <th>Assigned Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedMaterials.map((mat) => (
                                        <tr key={mat._id}>
                                            <td>{mat.name}</td>
                                            <td>{mat.quantity}</td>
                                            <td>{mat.unit}</td>
                                            <td>${mat.unitPrice}</td>
                                            <td>${(mat.quantity * mat.unitPrice).toFixed(2)}</td>
                                            <td>{new Date(mat.assignedDate).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    className="edit-button"
                                                    onClick={() => openEditMaterial(mat)}>
                                                    Edit
                                                </button>
                                                <button
                                                    className="delete-button"
                                                    onClick={() => assignMaterial(mat._id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-data-text">No materials assigned yet.</p>
                        )}
                    </div>

                    {/* Employees Summary */}
                    <div className="summary-section">
                        <h3 className="section-title">Assigned Employees</h3>
                        {assignedEmployees.length > 0 ? (
                            <table className="summary-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Designation</th>
                                        <th>Work Type</th>
                                        <th>Assigned Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedEmployees.map((emp) => (
                                        <tr key={emp._id}>
                                            <td>{emp.name}</td>
                                            <td>{emp.designation}</td>
                                            <td>{emp.remarks}</td>
                                            <td>{new Date(emp.assignedDate).toLocaleDateString()}</td>
                                            <td>
                                                <button className="edit-button"
                                                    onClick={() => openEditEmployees(emp._id)}>
                                                    Edit
                                                </button>
                                                <button className="delete-button"
                                                    onClick={() => assignEmployees(emp._id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-data-text">No employees assigned yet.</p>
                        )}
                    </div>
                </div>

                {/* Popups */}
                {activePopup === 'materials' && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <div className="popup-header">
                                <h3>Assign Materials</h3>
                                <button className="close-button" onClick={closePopup}>×</button>
                            </div>
                            <div className="popup-body">
                                <table className="assignment-table">
                                    <thead>
                                        <tr>
                                            <th>Material Name</th>
                                            <th>Available Quantity</th>
                                            <th>Unit</th>
                                            <th>Assign Quantity</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {availableMaterials.map((mat) => (
                                            <tr key={mat._id}>
                                                <td>{mat.name}</td>
                                                <td>{mat.quantity}</td>
                                                <td>{mat.unit}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={mat.quantity}
                                                        value={materialQuantities[mat._id] || ""}
                                                        onChange={(e) => handleQuantityChange(mat._id, e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        className="assign-button"
                                                        onClick={() => assignMaterial(mat._id)}
                                                        disabled={!materialQuantities[mat._id] || materialQuantities[mat.id] <= 0}
                                                    >
                                                        Assign
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="popup-footer">
                                <button className="done-button" onClick={closePopup}>Done</button>
                            </div>
                        </div>
                    </div>
                )}

                {activePopup === 'employees' && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <div className="popup-header">
                                <h3>Assign Employees</h3>
                                <button className="close-button" onClick={closePopup}>×</button>
                            </div>

                            {/* Employees Assign */}
                            <div className="popup-body">
                                <table className="assignment-table">
                                    <thead>
                                        <tr>
                                            <th>Employee Name</th>
                                            <th>Designation</th>
                                            <th>Remarks</th>
                                            <th>Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {availableEmployees.map((emp) => (
                                            <tr key={emp.id}>
                                                <td>{emp.name}</td>
                                                <td>{emp.designation}</td>
                                                <td>{emp.remarks}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedEmployees[emp._id] || false}
                                                        onChange={() => handleEmployeeChange(emp._id)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="popup-footer">
                                <button className="assign-button" onClick={assignEmployees}>Assign Selected</button>
                                <button className="done-button" onClick={closePopup}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {activePopup === 'daterange' && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <div className="popup-header">
                                <h3>Set Project Timeline</h3>
                                <button className="close-button" onClick={closePopup}>×</button>
                            </div>
                            <div className="popup-body">
                                <div className="date-range-inputs">
                                    <div className="input-group">
                                        <label>Start Date:</label>
                                        <input
                                            type="date"
                                            value={assignedDateRange.start}
                                            onChange={(e) => setAssignedDateRange(prev => ({ ...prev, start: e.target.value }))}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>End Date:</label>
                                        <input
                                            type="date"
                                            value={assignedDateRange.end}
                                            onChange={(e) => setAssignedDateRange(prev => ({ ...prev, end: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="popup-footer">
                                <button className="assign-button" onClick={closePopup}>Save Timeline</button>
                                <button className="done-button" onClick={closePopup}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Material Modal */}
                {editMaterial && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <div className="popup-header">
                                <h3>Edit Material Assignment</h3>
                                <button className="close-button" onClick={() => setEditMaterial(null)}>×</button>
                            </div>
                            <div className="popup-body">
                                <div className="edit-form">
                                    <div className="input-group">
                                        <label>Material:</label>
                                        <input type="text" value={editMaterial.name} disabled />
                                    </div>
                                    <div className="input-group">
                                        <label>Quantity:</label>
                                        <input
                                            type="number"
                                            value={editMaterial.quantity}
                                            onChange={(e) => setEditMaterial({
                                                ...editMaterial,
                                                quantity: parseInt(e.target.value)
                                            })}
                                            min="1"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Unit:</label>
                                        <input type="text" value={editMaterial.unit} disabled />
                                    </div>
                                    <div className="input-group">
                                        <label>Unit Price:</label>
                                        <input type="text" value={editMaterial.unitPrice} disabled />
                                    </div>
                                </div>
                            </div>
                            <div className="popup-footer">
                                <button className="save-button" onClick={saveEditMaterials}>Save Changes</button>
                                <button className="done-button" onClick={() => setEditMaterial(null)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Employee Modal */}
                {editEmployee && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <div className="popup-header">
                                <h3>Edit Employee Assignment</h3>
                                <button className="close-button" onClick={() => setEditEmployee(null)}>×</button>
                            </div>
                            <div className="popup-body">
                                <div className="edit-form">
                                    <div className="input-group">
                                        <label>Name:</label>
                                        <input type="text" value={editEmployee.name} disabled />
                                    </div>
                                    <div className="input-group">
                                        <label>Designation:</label>
                                        <input
                                            type="text"
                                            value={editEmployee.designation}
                                            onChange={(e) => setEditEmployee({
                                                ...editEmployee,
                                                designation: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Work Type:</label>
                                        <input
                                            type="text"
                                            value={editEmployee.remarks}
                                            onChange={(e) => setEditEmployee({
                                                ...editEmployee,
                                                remarks: e.target.value
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="popup-footer">
                                <button className="save-button" onClick={() => {
                                    setAssignedEmployees(prev =>
                                        prev.map(emp => emp._id === editEmployee._id ? editEmployee : emp)
                                    );
                                    setEditEmployee(null);
                                }}>Save Changes</button>
                                <button className="done-button" onClick={() => setEditEmployee(null)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Action buttons */}
                <div className="action-buttons">
                    <button
                        className="save-button"
                        onClick={saveAllAssignments}
                    >
                        Save Assignments
                    </button>

                    <button
                        className="view-button"
                        onClick={viewProject}
                        disabled={!saveSuccess}
                    >
                        <FaEye /> View Project
                    </button>

                    <button
                        className="view-button"
                        navigate='/construction-company-react-app/generateSketch'
                        disabled={!saveSuccess}
                    >
                      Cancel
                    </button>

                    {!saveSuccess && (
                        <p className="note">Save assignments first to enable the View button</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;