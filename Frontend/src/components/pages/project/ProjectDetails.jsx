import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUser, FaBuilding, FaInfoCircle } from "react-icons/fa";
import "../project/projectList.css";

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [availableMaterials, setAvailableMaterials] = useState([]);
    const [assignedMaterials, setAssignedMaterials] = useState([]);
    const [materialQuantities, setMaterialQuantities] = useState({});

    useEffect(() => {
        loadProject();
        loadAvailableMaterials();
    }, []);


    const loadProject = async () => {
        try {
            const response = await fetch(`http://localhost:5000/projectDetails/${id}`);
            const data = await response.json();
            setProject(data);
            setAssignedMaterials(data.assignedMaterials || []);
        } catch (error) {
            console.error("Error fetching project:", error);
        }
    };


    const loadAvailableMaterials = async () => {
        try {
            const response = await fetch("http://localhost:5000/fetch-materials");
            const data = await response.json();
            setAvailableMaterials(data);
        } catch (error) {
            console.error("Error fetching materials:", error);
        }
    };


    const handleQuantityChange = (materialId, quantity) => {

        setMaterialQuantities((prev) => ({
            ...prev,
            [materialId]: quantity,
        }));
    };


    const assignMaterial = (materialId) => {
        const selectedMaterial = availableMaterials.find((mat) => mat.id === materialId);
        const assignQuantity = parseInt(materialQuantities[materialId], 10);

        if (!selectedMaterial || isNaN(assignQuantity) || assignQuantity <= 0 || assignQuantity > selectedMaterial.quantity) {
            alert("Invalid quantity! Please enter a valid number.");
            return;
        }


        setAssignedMaterials((prevAssigned) => {
            const existingIndex = prevAssigned.findIndex((mat) => mat.id === materialId);

            if (existingIndex !== -1) {
                return prevAssigned.map((mat, index) =>
                    index === existingIndex
                        ? { ...mat, quantity: mat.quantity + assignQuantity }
                        : mat
                );
            } else {
                return [...prevAssigned, { id: materialId, name: selectedMaterial.name, quantity: assignQuantity }];
            }
        });

        setAvailableMaterials((prevAvailable) =>
            prevAvailable.map((mat) =>
                mat.id === materialId ? { ...mat, quantity: mat.quantity - assignQuantity } : mat
            )
        );

        setMaterialQuantities((prev) => ({ ...prev, [materialId]: "" }));
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
                    <div className="project-info">
                        <div className="info-item">
                            <FaBuilding className="icon building" />
                            <p><strong>Name:</strong> {project.name}</p>
                        </div>

                        <div className="info-item">
                            <FaUser className="icon user" />
                            <p><strong>Client:</strong> {project.client}</p>
                        </div>

                        <div className="info-item">
                            <FaInfoCircle className="icon status" />
                            <p><strong>Status:</strong> {project.status}</p>
                        </div>
                    </div>
                ) : (
                    <p>Loading project details...</p>
                )}

                {/* Assigned Materials */}
                <h3 className="section-title">Assigned Materials</h3>
                <div className="assigned-materials-container">
                    {assignedMaterials.length > 0 ? (
                        <div className="materials-row">
                            {assignedMaterials.map((mat) => (
                                <div key={mat.id} className="material-card">
                                    <h4 className="material-name">{mat.name}</h4>
                                    <p><strong>Quantity:</strong> {mat.quantity} {mat.unit}</p>
                                    <p><strong>Unit Price:</strong> ${mat.unitPrice}</p>
                                    <p><strong>Total Price:</strong> ${mat.quantity * mat.unitPrice}</p>
                                    <p><strong>Assigned On:</strong> {new Date(mat.assignedDate).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data-text">No materials assigned yet.</p>
                    )}
                </div>
                <ul>
                    {assignedMaterials.map((mat) => (
                        <li key={mat.id}>{mat.name} - {mat.quantity} units</li>
                    ))}
                </ul>

                {/* Available Materials Table */}
                <h3>Available Materials</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Material Name</th>
                            <th>Available Quantity</th>
                            <th>Unit Of Messure</th>
                            <th>Assign Quantity</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availableMaterials.map((mat) => (
                            <tr key={mat.id}>
                                <td>{mat.name}</td>
                                <td>{mat.quantity}</td>
                                <td>{mat.unit}</td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        max={mat.quantity}
                                        value={materialQuantities[mat.id] || ""}
                                        onChange={(e) => handleQuantityChange(mat.id, e.target.value)}
                                    />
                                </td>
                                <td>
                                    <button className="assign-button" onClick={() => assignMaterial(mat.id)}>
                                        Assign
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>


    );
};

export default ProjectDetails;
