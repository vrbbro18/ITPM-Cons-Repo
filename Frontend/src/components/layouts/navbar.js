import React from 'react'
import "../assets/css/AdminDashboard.css";

const navbar = () => {
  return (
    <div>
      <h2 className="sidebar-title">Build Ease</h2>
        <nav>
          <ul className="sidebar-menu">
            <li><a href="/construction-company-react-app/MainDashboard"><i className="fas fa-home"></i> Home</a></li>
            <li><a href="/admin/dashboard"><i className="fas fa-user"></i> Customer Requests</a></li>
            <li><a href="/construction-company-react-app/projects"><i className="fas fa-tasks"></i> Projects</a></li>
            <li><a href="/construction-company-react-app/MaterialDashboard"><i className="fas fa-envelope"></i> Stocks & Materials</a></li>
            <li><a href="/admin/settings"><i className="fas fa-shopping-cart"></i> Billing & Payments</a></li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="logout-button">
          <i className="fas fa-sign-out-alt"></i> 
        </div>
    </div>
  )
}

export default navbar
