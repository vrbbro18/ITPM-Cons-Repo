import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
// import "../../../assets/css/Materials/MaterialDashboard.css"

const MaterialForm = () => {
    const navigate = useNavigate();

    const [materials, setMaterials] = useState([]);
    const [MaterialEntry, setMaterialEntry] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [dateOfPurchase, setDateOfPurchase] = useState('');
    const [Remarks, setRemarks] = useState('');

    useEffect(() => {
        getMaterials();
        getEntryMaterials();
    }, []);

    const getMaterials = async() =>{
        try{
            const response = await axios.get("http://localhost:5000/add-materials");
            setMaterials(response.data);
        }catch(error){
            console.error("Error fetching Materials", error);
        }
    }

    const getEntryMaterials = async() =>{
        try{
            const res = await axios.get("http://localhost:5000/fetch-materials");
            setMaterialEntry(res.data);
        }catch(error){
            console.error("Error fetching Entry Materials", error);
        }
    }

    const handleMaterialChange = (e) => {
        const material = materials.find(mat => mat._id === e.target.value);
        setSelectedMaterial(material);
        setTotalPrice(material ? material.unitPrice * quantity : 0);
    };

    const handleQuantityChange = (event) => {
        const qty = parseFloat(event.target.value);
        setQuantity(qty);
        if (selectedMaterial) {
            setTotalPrice(qty * selectedMaterial.unitPrice);
        }
    };

    const handleDateOfPurchaseChange = (event) =>{
        setDateOfPurchase(event.target.value);
    }

    const handleRemarksChange = (event) =>{
        setRemarks(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedMaterial || quantity <= 0) return alert("Invalid input");

        try {
            await axios.post("http://localhost:5000/fetch-materials/add", {
                materialId: selectedMaterial._id,
                quantity,
                dateOfPurchase,
                Remarks
            });
            alert("Material added successfully!");
        } catch (error) {
            console.error("Error adding material:", error);
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

                
                <div className="logout-button">
                    <i className="fas fa-sign-out-alt"></i>
                </div>
            </aside>
            <div style={styles.pageContainer}>
                <h2 style={styles.title}>Manage Stocks</h2>

                <form style={styles.form} onSubmit={handleSubmit}>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Material Name:</label>
                        <select style={styles.input} onChange={handleMaterialChange}>
                            <option>Select Material</option>
                            {materials.map(mat => (
                                <option key={mat._id} value={mat._id}>{mat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.column}>
                            <label style={styles.label}>Unit Of Measure:</label>
                            <input type='text' style={styles.disabledInput} value={selectedMaterial?.unit || ""} disabled />
                        </div>

                        <div style={styles.column}>
                            <label style={styles.label}>Unit Price:</label>
                            <input type='text' style={styles.disabledInput} value={selectedMaterial?.unitPrice || ""} disabled />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.column}>
                            <label style={styles.label}>Quantity:</label>
                            <input type="number" style={styles.input} value={quantity} onChange={handleQuantityChange} />
                        </div>

                        <div style={styles.column}>
                            <label style={styles.label}>Added Date:</label>
                            <input type="Date" style={styles.input} value={dateOfPurchase} onChange={handleDateOfPurchaseChange} />
                        </div>
                    </div>

                    <div style={styles.row}>

                        <div style={styles.column}>
                            <label style={styles.label}>Total Price:</label>
                            <input type="text" style={styles.disabledInput} value={totalPrice} disabled />
                        </div>

                        <div style={styles.column}>
                            <label style={styles.label}>Remarks:</label>
                            <input type="text" style={styles.input} value={Remarks} onChange={handleRemarksChange} />
                        </div>
                    </div>

                    <button type="submit" style={styles.button}>Add Material</button>
                </form>
            </div>

            <h3>Stock Table</h3>
            <div style={styles.materialTableContainer}></div>
            <table style={styles.materialsTable}>
                <thead>
                    <tr>
                        <td>Material Name</td>
                        <td>Unit Of Measure</td>
                        <td>Unit Price</td>
                        <td>Quantity</td>
                        <td>Added Date</td>
                        <td>Total Price</td>
                        <td>Remarks</td>
                    </tr>
                </thead>
                <tbody>
                    {MaterialEntry.length > 0? (
                        MaterialEntry.map((MaterialEntry, index) =>(
                            <tr key={index}>
                                {/* <td>{index + 1}</td> */}
                                <td>{MaterialEntry.name}</td>
                                <td>{MaterialEntry.unit}</td>
                                <td>{MaterialEntry.unitPrice}</td>
                                <td>{MaterialEntry.quantity}</td>
                                <td>{MaterialEntry.dateOfPurchase}</td>
                                <td>{MaterialEntry.totalPrice}</td>
                                <td>{MaterialEntry.Remarks}</td>
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
    );
};

const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: '22px',
        color: '#333',
        marginBottom: '15px',
        marginLeft: '150px',
    },
    
    form: {
        marginBottom: '80px',
        marginLeft: '150px',
        width: '900px',
        padding: '20px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    formGroup: {
        marginBottom: '12px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '4px',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '12px',
    },
    disabledInput: {
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '12px',
        backgroundColor: '#e9ecef',
        color: '#6c757d',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '40px',
        marginBottom: '10px',
    },
    column: {
        flex: '5',
    },
    button: {
        width: '100%',
        padding: '10px',
        background: '#007bff',
        border: 'none',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        borderRadius: '5px',
        transition: 'background 0.3s ease-in-out',
    },
    materialTableContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginLeft: '230px',
    },
    materialsTable: {
        width: '80%',
        gap: '15px',
        margin: '20px auto',
        marginTop: '30px',
        borderCollapse: 'collapse',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    },
    materialsTableHeader: {
        backgroundColor: '#414750',
        color: 'white',
    },
    materialsTableRow: {
        backgroundColor: '#f9f9f9',
    }
};

export default MaterialForm;
