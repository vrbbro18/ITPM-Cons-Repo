import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUser, FaBuilding, FaEdit, FaTrash, FaInfoCircle, FaTools, FaUsers, FaCalendarAlt } from "react-icons/fa";
import "../project/projectList.css";

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [availableMaterials, setAvailableMaterials] = useState([]);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [assignedMaterials, setAssignedMaterials] = useState([]);
    const [materialQuantities, setMaterialQuantities] = useState({});
    const [activePopup, setActivePopup] = useState(null);
    const [assignedEmployees, setAssignedEmployees] = useState([]);
    const [assignedDateRange, setAssignedDateRange] = useState({ start: '', end: '' });
    const [selectedEmployees, setSelectedEmployees] = useState({});

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

        setSelectedEmployees({}); // Reset selection
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

    const openPopup = (popupType) => {
        setActivePopup(popupType);
    };

    const closePopup = () => {
        setActivePopup(null);
    };

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
                    </ul>
                </nav>
                <div className="logout-button">
                    <i className="fas fa-sign-out-alt"></i>
                </div>
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
                    {/* Materials Summary */}
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
                                        <th>Assigned On</th>
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
                                                    onClick={() => assignMaterial(mat._id)}>
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
                                        <th>Role</th>
                                        <th>Assigned On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedEmployees.map((emp) => (
                                        <tr key={emp._id}>
                                            <td>{emp.name}</td>
                                            <td>{emp.designation}</td>
                                            <td>{new Date(emp.assignedDate).toLocaleDateString()}</td>
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
                                {/* Date range picker form would go here */}
                                <p>Date range assignment functionality to be implemented</p>
                            </div>
                            <div className="popup-footer">
                                <button className="done-button" onClick={closePopup}>Done</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;