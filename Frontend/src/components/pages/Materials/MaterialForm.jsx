import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaHome, FaPlus, FaWarehouse, FaChartBar, FaCreditCard, FaSignOutAlt, FaSearch } from "react-icons/fa";

const MaterialForm = () => {
    const navigate = useNavigate();

    const [materials, setMaterials] = useState([]);
    const [MaterialEntry, setMaterialEntry] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [name, setName] = useState(null);
    const [unit, setUnit] = useState(null);
    const [unitPrice, setUnitPrice] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [dateOfPurchase, setDateOfPurchase] = useState('');
    const [Remarks, setRemarks] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        getMaterials();
        getEntryMaterials();
    }, []);

    const getMaterials = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/add-materials");
            setMaterials(response.data);
        } catch (error) {
            console.error("Error fetching Materials", error);
        } finally {
            setIsLoading(false);
        }
    }
    
    //getEntrymaterials function
    const getEntryMaterials = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/fetch-materials/getmat");
            setMaterialEntry(res.data);
        } catch (error) {
            console.error("Error fetching Entry Materials", error);
        } finally {
            setIsLoading(false);
        }
    }

    //handleMaterialChange function
    const handleMaterialChange = (e) => {
        const material = materials.find(mat => mat._id === e.target.value);
        setSelectedMaterial(material);
        setName(material ? material.name : "");
        setUnit(material ? material.unit : "");
        setUnitPrice(material? material.unitPrice: "");
        setTotalPrice(material ? material.unitPrice * quantity : 0);
    };

    const handleQuantityChange = (event) => {
        const qty = parseFloat(event.target.value);
        setQuantity(qty);
        if (selectedMaterial) {
            setTotalPrice(qty * selectedMaterial.unitPrice);
        }
    };

    const handleDateOfPurchaseChange = (event) => {
        setDateOfPurchase(event.target.value);
    }

    const handleRemarksChange = (event) => {
        setRemarks(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedMaterial || quantity <= 0) {
            showNotification("Please select a material and enter a valid quantity", "error");
            return;
        }

        setIsLoading(true);
        try {
            await axios.post("http://localhost:5000/fetch-materials/add", {
                materialId: selectedMaterial._id,
                name,
                quantity,
                unit,
                unitPrice,
                dateOfPurchase,
                Remarks
            });
            
            showNotification("Material added successfully!", "success");
            getEntryMaterials();

            // Clear form fields
            setSelectedMaterial(null);
            setName("");
            setUnit("");
            setQuantity(0);
            setTotalPrice(0);
            setDateOfPurchase('');
            setRemarks('');
        } catch (error) {
            showNotification("Error adding material", "error");
            console.error("Error adding material:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const showNotification = (message, type) => {
        setSuccessMessage({ text: message, type });
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatCurrency = (amount) => {
        return parseFloat(amount).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
    };

    return (
        <div style={styles.mainContainer}>
            <div className="sidebar">
                    <h2 className="sidebar-title">Stocks & Materials</h2>
                    <nav>
                      <ul className="sidebar-menu">
                        <li><a href="/construction-company-react-app/MainDashboard"><FaHome className="menu-icon" /> Dashboard</a></li>
                        <li><a href="/construction-company-react-app/AddMaterial"><FaPlus className="menu-icon" /> Add Materials</a></li>
                        <li className="active"><a href="/construction-company-react-app/MaterialForm"><FaWarehouse className="menu-icon" /> Stock Management</a></li>
                        <li><a href="/construction-company-react-app/MaterialForm"><FaChartBar className="menu-icon" /> Reports & Analytics</a></li>
                        <li><a href="/admin/settings"><FaCreditCard className="menu-icon" /> Billing & Payments</a></li>
                      </ul>
                    </nav>
            
                    <div className="logout-button">
                      <FaSignOutAlt /> Logout
                    </div>
                  </div>

            <div style={styles.contentArea}>
                <header style={styles.header}>
                    <h1 style={styles.headerTitle}>Stock Management System</h1>
                    <div style={styles.headerActions}>
                        <div style={styles.searchBar}>
                            <input type="text" placeholder="Search materials..." style={styles.searchInput} />
                            <button style={styles.searchButton}>🔍</button>
                        </div>
                        <div style={styles.userInfo}>
                            <span style={styles.notifications}>🔔</span>
                            <span style={styles.userAvatar}>👤</span>
                        </div>
                    </div>
                </header>

                <div style={styles.pageContent}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.title}>Add New Stock</h2>
                        <p style={styles.subtitle}>Enter material details to add to inventory</p>
                    </div>

                    {successMessage && (
                        <div style={{
                            ...styles.notification,
                            backgroundColor: successMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                            color: successMessage.type === 'success' ? '#155724' : '#721c24',
                        }}>
                            {successMessage.text}
                        </div>
                    )}

                    <form style={styles.form} onSubmit={handleSubmit}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Material Name:</label>
                            <select 
                                style={styles.select} 
                                onChange={handleMaterialChange}
                                value={selectedMaterial?._id || ""}
                            >
                                <option value="">Select Material</option>
                                {materials.map(mat => (
                                    <option key={mat._id} value={mat._id}>{mat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.row}>
                            <div style={styles.column}>
                                <label style={styles.label}>Unit Of Measure:</label>
                                <input 
                                    type='text' 
                                    style={styles.disabledInput} 
                                    value={selectedMaterial?.unit || ""} 
                                    disabled 
                                />
                            </div>

                            <div style={styles.column}>
                                <label style={styles.label}>Unit Price:</label>
                                <input 
                                    type='text' 
                                    style={styles.disabledInput} 
                                    value={selectedMaterial?.unitPrice ? formatCurrency(selectedMaterial.unitPrice) : ""} 
                                    disabled 
                                />
                            </div>
                        </div>

                        <div style={styles.row}>
                            <div style={styles.column}>
                                <label style={styles.label}>Quantity:</label>
                                <input 
                                    type="number" 
                                    style={styles.input} 
                                    value={quantity} 
                                    onChange={handleQuantityChange} 
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div style={styles.column}>
                                <label style={styles.label}>Added Date:</label>
                                <input 
                                    type="date" 
                                    style={styles.input} 
                                    value={dateOfPurchase} 
                                    onChange={handleDateOfPurchaseChange} 
                                />
                            </div>
                        </div>

                        <div style={styles.row}>
                            <div style={styles.column}>
                                <label style={styles.label}>Total Price:</label>
                                <input 
                                    type="text" 
                                    style={styles.disabledInput} 
                                    value={formatCurrency(totalPrice)} 
                                    disabled 
                                />
                            </div>

                            <div style={styles.column}>
                                <label style={styles.label}>Remarks:</label>
                                <input 
                                    type="text" 
                                    style={styles.input} 
                                    value={Remarks} 
                                    onChange={handleRemarksChange} 
                                    placeholder="Add notes or comments"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            style={styles.button}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Add Material to Stock'}
                        </button>
                    </form>

                    <div style={styles.tableSection}>
                        <div style={styles.tableHeader}>
                            <h3 style={styles.tableTitle}>Current Stock Inventory</h3>
                            <div style={styles.tableActions}>
                                <button style={styles.refreshButton} onClick={getEntryMaterials}>
                                    🔄 Refresh
                                </button>
                                <button style={styles.exportButton}>
                                    📥 Export
                                </button>
                            </div>
                        </div>

                        <div style={styles.tableContainer}>
                            {isLoading ? (
                                <div style={styles.loadingState}>Loading stock data...</div>
                            ) : (
                                <table style={styles.table}>
                                    <thead style={styles.tableHead}>
                                        <tr>
                                            <th style={styles.tableHeaderCell}>Material Name</th>
                                            <th style={styles.tableHeaderCell}>Unit</th>
                                            <th style={styles.tableHeaderCell}>Unit Price</th>
                                            <th style={styles.tableHeaderCell}>Quantity</th>
                                            <th style={styles.tableHeaderCell}>Added Date</th>
                                            <th style={styles.tableHeaderCell}>Total Price</th>
                                            <th style={styles.tableHeaderCell}>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MaterialEntry.length > 0 ? (
                                            MaterialEntry.map((entry, index) => (
                                                <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                                                    <td style={styles.tableCell}>{entry.name}</td>
                                                    <td style={styles.tableCell}>{entry.unit}</td>
                                                    <td style={styles.tableCell}>{formatCurrency(entry.unitPrice)}</td>
                                                    <td style={styles.tableCell}>{entry.quantity}</td>
                                                    <td style={styles.tableCell}>{formatDate(entry.dateOfPurchase)}</td>
                                                    <td style={styles.tableCell}>{formatCurrency(entry.totalPrice)}</td>
                                                    <td style={styles.tableCell}>{entry.Remarks || "-"}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" style={styles.emptyState}>
                                                    No materials added yet. Use the form above to add materials.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    mainContainer: {
        display: 'flex',
        height: '100vh',
        fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f5f7fa',
        color: '#333',
    },
    sidebar: {
        width: '260px',
        backgroundColor: '#2c3e50',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
    },
    sidebarTitle: {
        padding: '20px',
        fontSize: '20px',
        fontWeight: 'bold',
        borderBottom: '1px solid #3d5369',
        margin: 0,
        textAlign: 'center',
    },
    sidebarProfile: {
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid #3d5369',
    },
    profileAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#1abc9c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        marginRight: '10px',
    },
    profileInfo: {
        fontSize: '14px',
    },
    sidebarMenu: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        flexGrow: 1,
    },
    menuItem: {
        margin: '5px 0',
    },
    activeMenuItem: {
        backgroundColor: '#3498db',
    },
    menuLink: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 20px',
        color: '#ecf0f1',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
    },
    activeMenuLink: {
        color: '#fff',
        fontWeight: 'bold',
    },
    menuIcon: {
        marginRight: '10px',
        fontSize: '18px',
        width: '20px',
        textAlign: 'center',
    },
    logoutButton: {
        margin: '20px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e74c3c',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    logoutIcon: {
        marginRight: '8px',
    },
    contentArea: {
        flex: 1,
        marginLeft: '260px',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'auto',
    },
    header: {
        backgroundColor: 'white',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
        zIndex: 5,
    },
    headerTitle: {
        margin: 0,
        fontSize: '24px',
        fontWeight: '600',
        color: '#2c3e50',
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
    },
    searchBar: {
        display: 'flex',
        marginRight: '20px',
    },
    searchInput: {
        padding: '8px 15px',
        border: '1px solid #ddd',
        borderRadius: '5px 0 0 5px',
        outline: 'none',
        minWidth: '200px',
    },
    searchButton: {
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '0 5px 5px 0',
        padding: '8px 15px',
        cursor: 'pointer',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
    },
    notifications: {
        fontSize: '20px',
        marginRight: '15px',
        cursor: 'pointer',
    },
    userAvatar: {
        fontSize: '20px',
        cursor: 'pointer',
    },
    pageContent: {
        padding: '30px',
        flex: 1,
    },
    cardHeader: {
        marginBottom: '20px',
    },
    title: {
        fontSize: '22px',
        fontWeight: '600',
        margin: '0 0 5px 0',
        color: '#2c3e50',
    },
    subtitle: {
        fontSize: '14px',
        color: '#7f8c8d',
        margin: 0,
    },
    notification: {
        padding: '12px 15px',
        borderRadius: '5px',
        marginBottom: '20px',
        fontSize: '14px',
    },
    form: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '25px',
        marginBottom: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#2c3e50',
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '14px',
        transition: 'border-color 0.3s ease',
        outline: 'none',
    },
    select: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '14px',
        backgroundColor: 'white',
        outline: 'none',
        cursor: 'pointer',
    },
    disabledInput: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '14px',
        backgroundColor: '#f8f9fa',
        color: '#6c757d',
    },
    row: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
    },
    column: {
        flex: 1,
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#3498db',
        border: 'none',
        color: 'white',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
    },
    tableSection: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '25px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    },
    tableHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    tableTitle: {
        fontSize: '18px',
        fontWeight: '600',
        margin: 0,
        color: '#2c3e50',
    },
    tableActions: {
        display: 'flex',
        gap: '10px',
    },
    refreshButton: {
        padding: '8px 15px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
    exportButton: {
        padding: '8px 15px',
        backgroundColor: '#27ae60',
        border: 'none',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
    tableContainer: {
        overflow: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
    },
    tableHead: {
        backgroundColor: '#f5f7fa',
    },
    tableHeaderCell: {
        padding: '12px 15px',
        textAlign: 'left',
        fontWeight: '600',
        color: '#2c3e50',
        borderBottom: '2px solid #eee',
    },
    tableCell: {
        padding: '12px 15px',
        borderBottom: '1px solid #eee',
    },
    evenRow: {
        backgroundColor: '#f9f9f9',
    },
    oddRow: {
        backgroundColor: 'white',
    },
    emptyState: {
        padding: '30px',
        textAlign: 'center',
        color: '#7f8c8d',
    },
    loadingState: {
        padding: '30px',
        textAlign: 'center',
        color: '#7f8c8d',
    },
};

export default MaterialForm;