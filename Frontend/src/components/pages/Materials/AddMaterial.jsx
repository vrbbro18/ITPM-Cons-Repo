import React, { useState } from "react";
import axios from "axios";
import "../../../assets/css/Materials/MaterialDashboard.css"
import { useEffect } from "react";
import { CgPathCrop } from "react-icons/cg";

const AddMaterial = () => {
    const [name, setName] = useState("");
    const [unit, setUnit] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [materials, setMaterials] = useState([])
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchMaterials();
    }, [])

    const fetchMaterials = async () => {
        try {
            const response = await axios.get("http://localhost:5000/add-materials");
            setMaterials(response.data)
        } catch (error) {
            console.log("Error fethcing Materials", error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/add-materials/add", {
                name,
                unit,
                unitPrice: parseFloat(unitPrice),
            });
            setMessage(response.data.message);
            setName("");
            setUnit("");
            setUnitPrice("");
        } catch (error) {
            setMessage(error.response?.data?.message || "Error adding material");
        }
    };

    return (
        <div>
            <aside className="sidebar">
                <h2 className="sidebar-title">Stocks & Materials</h2>
                <nav>
                    <ul className="sidebar-menu">
                        <li><a href="/construction-company-react-app/MaterialDashboard"><i className="fas fa-home"></i>Dashboard</a></li>
                        <li><a href="/construction-company-react-app/AddMaterial"><i className="fas fa-user"></i> Add Materials</a></li>
                        <li><a href="/construction-company-react-app/MaterialForm"><i className="fas fa-tasks"></i> Stock Management</a></li>
                        <li><a href="/construction-company-react-app/MaterialForm"><i className="fas fa-envelope"></i> Reports & Analytics</a></li>
                        <li><a href="/admin/settings"><i className="fas fa-shopping-cart"></i> Billing & Payments</a></li>
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="logout-button">
                    <i className="fas fa-sign-out-alt"></i>
                </div>
            </aside>

           
                <div className="add-material-container">
                    <h2>Add Material</h2>
                    {message && <p>{message}</p>}
                    <form className="add-material-form" onSubmit={handleSubmit}>
                        <label>Material Name:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                        <label>Unit of Measure:</label>
                        <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} required />

                        <label>Unit Price:</label>
                        <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} required />

                        <button type="submit">Add Material</button>
                    </form>
                </div>


                <h3>All Materials</h3>
                <div className="materialTableContainer">
                    <table className="materials-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Material Name</th>
                                <th>Unit of Measure</th>
                                <th>Unit Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.length > 0 ? (
                                materials.map((materials, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{materials.name}</td>
                                        <td>{materials.unit}</td>
                                        <td>{materials.unitPrice}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="no-data">No materials added yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            
        </div>
    );
};

export default AddMaterial;
