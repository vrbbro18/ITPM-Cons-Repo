import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { Outlet } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "../assets/css/AdminDashboard.css";

const AdminDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  // Sample data
  const completedProjects = [
    { name: "Project A", client: "Client X", review: "⭐⭐⭐⭐⭐ Excellent work!", date: "Mar 15, 2025" },
    { name: "Project B", client: "Client Y", review: "⭐⭐⭐⭐ Satisfied with the outcome.", date: "Mar 10, 2025" },
    { name: "Project C", client: "Client Z", review: "⭐⭐⭐⭐⭐ Highly recommended!", date: "Mar 5, 2025" },
  ];

  const recentInquiries = [
    { client: "Client A", type: "New Project", date: "Mar 29, 2025", priority: "High" },
    { client: "Client B", type: "Pricing Request", date: "Mar 28, 2025", priority: "Medium" },
    { client: "Client C", type: "Follow-up", date: "Mar 27, 2025", priority: "Low" },
  ];

  // Set greeting based on time of day
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now);
      
      const hour = now.getHours();
      let newGreeting = "";
      
      if (hour < 12) {
        newGreeting = "Good Morning";
      } else if (hour < 18) {
        newGreeting = "Good Afternoon";
      } else {
        newGreeting = "Good Evening";
      }
      
      setGreeting(newGreeting);
    };

    updateClock();
    const timer = setInterval(updateClock, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Build Ease</h2>
        <nav>
          <ul className="sidebar-menu">
            <li>
              <a href="/construction-company-react-app/MainDashboard">
                <i className="fas fa-home"></i> <span>Home</span>
              </a>
            </li>
            <li>
              <a href="/construction-company-react-app/customerDashboard">
                <i className="fas fa-user"></i> <span>Customer Requests</span>
              </a>
            </li>
            <li>
              <a href="/construction-company-react-app/ProjectDashboard">
                <i className="fas fa-tasks"></i> <span>Projects</span>
              </a>
            </li>
            <li>
              <a href="/construction-company-react-app/MaterialDashboard">
                <i className="fas fa-boxes"></i> <span>Stocks & Materials</span>
              </a>
            </li>
            <li>
              <a href="/admin/settings">
                <i className="fas fa-credit-card"></i> <span>Billing & Payments</span>
              </a>
            </li>
            <li>
              <a href="/admin/reports">
                <i className="fas fa-chart-bar"></i> <span>Reports</span>
              </a>
            </li>
            <li>
              <a href="/admin/settings">
                <i className="fas fa-cog"></i> <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="logout-button">
          <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header-info">
          <div className="welcome-section">
            <h1 className="main-title">{greeting}, Admin!</h1>
            <p className="current-date">{formatDate(currentTime)} | {formatTime(currentTime)}</p>
          </div>
          <div className="quick-actions">
            <button className="action-button">
              <i className="fas fa-plus"></i> New Project
            </button>
            <button className="action-button">
              <i className="fas fa-envelope"></i> Messages
              <span className="notification-badge">3</span>
            </button>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className="widget-grid">
          {/* Calendar Widget */}
          <div className="widget">
            <div className="calendar-container">
              <h3 className="calendar-title">Calendar</h3>
              <Calendar onChange={setDate} value={date} />
            </div>
          </div>

          {/* Project Status Widget */}
          <div className="widget">
            <h2 className="widget-title"><i className="fas fa-chart-pie"></i> Project Status</h2>
            <div className="status-container">
              <div className="status-item">
                <span><i className="fas fa-spinner"></i> Active Projects</span>
                <span className="status-number active">5</span>
              </div>
              <div className="status-item">
                <span><i className="fas fa-check-circle"></i> Completed Projects</span>
                <span className="status-number completed">12</span>
              </div>
              <div className="status-item">
                <span><i className="fas fa-clock"></i> Pending Projects</span>
                <span className="status-number pending">3</span>
              </div>
            </div>
          </div>

          {/* Inquiries Widget */}
          <div className="widget">
            <h2 className="widget-title"><i className="fas fa-bell"></i> Recent Inquiries</h2>
            <ul className="inquiries-list">
              {recentInquiries.map((inquiry, index) => (
                <li key={index} className={`priority-${inquiry.priority.toLowerCase()}`}>
                  <div className="inquiry-header">
                    <span className="inquiry-client">{inquiry.client}</span>
                    <span className="inquiry-date">{inquiry.date}</span>
                  </div>
                  <div className="inquiry-type">{inquiry.type}</div>
                  <div className="inquiry-priority">
                    Priority: <span className={`priority-tag ${inquiry.priority.toLowerCase()}`}>
                      {inquiry.priority}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Completed Projects */}
        <div className="completed-projects">
          <h2 className="table-title">Completed Projects and Reviews</h2>
          <table className="project-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Client Name</th>
                <th>Completion Date</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {completedProjects.map((project, index) => (
                <tr key={index}>
                  <td><strong>{project.name}</strong></td>
                  <td>{project.client}</td>
                  <td>{project.date}</td>
                  <td>{project.review}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;