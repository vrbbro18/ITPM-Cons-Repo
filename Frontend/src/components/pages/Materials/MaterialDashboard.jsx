import React from "react";
import "../../../assets/css/Materials/MaterialDashboard.css"

const MaterialDashboard = () => {
  return (
    <div className="dashboard-container">

      <div className="sidebar">
        <h2 className="sidebar-title">Stocks & Materials</h2>
        <nav>
          <ul className="sidebar-menu">
            <li><a href="/construction-company-react-app/MainDashboard"><i className="fas fa-home"></i>Dashboard</a></li>
            <li><a href="/construction-company-react-app/AddMaterial"><i className="fas fa-user"></i> Add Materials</a></li>
            <li><a href="/construction-company-react-app/MaterialForm"><i className="fas fa-tasks"></i> Stock Management</a></li>
            <li><a href="/construction-company-react-app/MaterialForm"><i className="fas fa-envelope"></i> Reports & Analytics</a></li>
            <li><a href="/admin/settings"><i className="fas fa-shopping-cart"></i> Billing & Payments</a></li>
          </ul>
        </nav>

        <div className="logout-button">
          <i className="fas fa-sign-out-alt"></i>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <h1>Material Management Dashboard</h1>

        </header>

        {/* Stats Overview */}
        <section className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Materials</h3>
            <p>120</p>
          </div>
          <div className="stat-card">
            <h3>Total Stock Value</h3>
            <p>$45,000</p>
          </div>
          <div className="stat-card">
            <h3>Recent Additions</h3>
            <p>15</p>
          </div>
        </section>
      </div>


    </div>
  );
};

export default MaterialDashboard;
