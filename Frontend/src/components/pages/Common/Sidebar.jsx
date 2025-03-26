import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <nav>
        <ul className="sidebar-menu">
          <li>
            <Link to="/MainDashboard">
              <i className="fas fa-home"></i> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/customerList">
              <i className="fas fa-users"></i> All Requests
            </Link>
          </li>
          <li>
            <Link to="/customerList/construction">
              <i className="fas fa-hard-hat"></i> Construction
            </Link>
          </li>
          <li>
            <Link to="/customerList/consulting">
              <i className="fas fa-chart-line"></i> Consulting
            </Link>
          </li>
          <li>
            <Link to="/customerForm">
              <i className="fas fa-plus-circle"></i> New Request
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;