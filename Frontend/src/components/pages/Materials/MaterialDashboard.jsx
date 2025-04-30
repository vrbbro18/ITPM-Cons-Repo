import React, { useState } from "react";
import "../../../assets/css/Materials/MaterialDashboard.css";
import { FaHome, FaPlus, FaWarehouse, FaChartBar, FaCreditCard, FaSignOutAlt, FaSearch } from "react-icons/fa";

const MaterialDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample materials data for demonstration
  const materials = [
    { id: 1, name: "Cement", quantity: 250, unit: "Bags", value: 5000, lastUpdated: "2025-03-28" },
    { id: 2, name: "Steel Rods", quantity: 500, unit: "Pieces", value: 12000, lastUpdated: "2025-03-27" },
    { id: 3, name: "Bricks", quantity: 5000, unit: "Pieces", value: 3500, lastUpdated: "2025-03-25" },
    { id: 4, name: "Sand", quantity: 30, unit: "Tons", value: 2400, lastUpdated: "2025-03-26" },
    { id: 5, name: "Gravel", quantity: 25, unit: "Tons", value: 1800, lastUpdated: "2025-03-24" },
    { id: 6, name: "Gravel", quantity: 25, unit: "Tons", value: 1800, lastUpdated: "2025-03-24" },

  ];
  
  // Filter materials based on search term
  const filteredMaterials = materials.filter(material => 
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate total values for stats cards
  const totalMaterials = materials.length;
  const totalStockValue = materials.reduce((sum, material) => sum + material.value, 0);
  const recentAdditions = materials.filter(m => new Date(m.lastUpdated) > new Date("2025-03-25")).length;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <h1>Material Management Dashboard</h1>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search materials..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </header>

        {/* Stats Overview */}
        <section className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Materials</h3>
            <p>{totalMaterials}</p>
            <div className="stat-footer">
              <span className="trend-up">↑ 5%</span> from last month
            </div>
          </div>
          <div className="stat-card">
            <h3>Total Stock Value</h3>
            <p>${totalStockValue.toLocaleString()}</p>
            <div className="stat-footer">
              <span className="trend-up">↑ 12%</span> from last month
            </div>
          </div>
          <div className="stat-card">
            <h3>Recent Additions</h3>
            <p>{recentAdditions}</p>
            <div className="stat-footer">
              <span className="trend-up">↑ 3</span> new items this week
            </div>
          </div>
        </section>

        {/* Materials Table */}
        <div className="materialTableContainer">
          <div className="materials-table-wrapper">
            <div className="table-header">
              <h2>Materials Inventory</h2>
              <button className="add-material-btn">Add New Material</button>
            </div>
            {filteredMaterials.length > 0 ? (
              <table className="materials-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Material Name</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Value ($)</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((material) => (
                    <tr key={material.id}>
                      <td>{material.id}</td>
                      <td>{material.name}</td>
                      <td>{material.quantity}</td>
                      <td>{material.unit}</td>
                      <td>${material.value.toLocaleString()}</td>
                      <td>{material.lastUpdated}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="edit-btn">Edit</button>
                          <button className="delete-btn">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">No materials found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDashboard;