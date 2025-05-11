import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUser, FaBuilding, FaInfoCircle, FaTools, FaUsers, FaCalendarAlt } from "react-icons/fa";
import "../project/projectList.css";

const ProjectView = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [assignedMaterials, setAssignedMaterials] = useState([]);
    const [assignedEmployees, setAssignedEmployees] = useState([]);
    const [assignedDateRange, setAssignedDateRange] = useState({ start: '', end: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProject();
    }, []);

    const loadProject = async () => {
        try {
            setLoading(true);
            // Fetch project details
            const projectResponse = await fetch(`http://localhost:5000/projectDetails/${id}`);
            const projectData = await projectResponse.json();
            setProject(projectData);
            
            // Fetch assigned materials
            const materialsResponse = await fetch(`http://localhost:5000/add-materials/project/${id}`);
            const materialsData = await materialsResponse.json();
            setAssignedMaterials(materialsData);
            
            // Fetch assigned employees
            const employeesResponse = await fetch(`http://localhost:5000/fetch-employees/project/${id}`);
            const employeesData = await employeesResponse.json();
            setAssignedEmployees(employeesData);
            
            // Set date range if available
            if (projectData.dateRange) {
                setAssignedDateRange(projectData.dateRange);
            }
            
            setLoading(false);
        } catch (error) {
            console.error("Error fetching project data:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading project details...</div>;
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
                <h2 className="title">Project View</h2>
                <button 
                    className="back-button"
                    onClick={() => window.history.back()}
                >
                    Back to Project Details
                </button>

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
                    <p>No project details available.</p>
                )}

                {/* Resource Summary */}
                <h3 className="section-title">Project Resources</h3>
                <div className="assignment-categories">
                    <div className="category-card">
                        <FaTools className="category-icon" />
                        <h4>Materials</h4>
                        <p>{assignedMaterials.length} items assigned</p>
                    </div>

                    <div className="category-card">
                        <FaUsers className="category-icon" />
                        <h4>Employees</h4>
                        <p>{assignedEmployees.length} employees assigned</p>
                    </div>

                    <div className="category-card">
                        <FaCalendarAlt className="category-icon" />
                        <h4>Project Timeline</h4>
                        <p>{assignedDateRange.start ? `${new Date(assignedDateRange.start).toLocaleDateString()} - ${new Date(assignedDateRange.end).toLocaleDateString()}` : 'Not set'}</p>
                    </div>
                </div>

                {/* Material List */}
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedMaterials.map((mat) => (
                                        <tr key={mat._id || mat.id}>
                                            <td>{mat.name}</td>
                                            <td>{mat.quantity}</td>
                                            <td>{mat.unit}</td>
                                            <td>${mat.unitPrice}</td>
                                            <td>${(mat.quantity * mat.unitPrice).toFixed(2)}</td>
                                            <td>{new Date(mat.assignedDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-data-text">No materials assigned yet.</p>
                        )}
                    </div>

                    {/* Employees List */}
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedEmployees.map((emp) => (
                                        <tr key={emp._id || emp.id}>
                                            <td>{emp.name}</td>
                                            <td>{emp.designation}</td>
                                            <td>{emp.remarks}</td>
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
            </div>
        </div>
    );
};

export default ProjectView;