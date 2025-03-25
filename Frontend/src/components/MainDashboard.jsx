import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../assets/css/AdminDashboard.css";

const AdminDashboard = () => {
  const [date, setDate] = useState(new Date());

  const completedProjects = [
    { name: "Project A", client: "Client X", review: "⭐⭐⭐⭐⭐ Excellent work!" },
    { name: "Project B", client: "Client Y", review: "⭐⭐⭐⭐ Satisfied with the outcome." },
    { name: "Project C", client: "Client Z", review: "⭐⭐⭐⭐⭐ Highly recommended!" },
  ];

  return (
    <div className="dashboard-container">
      {/* sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Build Ease</h2>
        <nav>
          <ul className="sidebar-menu">
            <li><a href="/construction-company-react-app/MainDashboard"><i className="fas fa-home"></i> Home</a></li>
            <li><a href="/admin/dashboard"><i className="fas fa-user"></i> Customer Requests</a></li>
            <li><a href="/construction-company-react-app/projects"><i className="fas fa-tasks"></i> Projects</a></li>
            <li><a href="/admin/inquiries"><i className="fas fa-envelope"></i> Stocks & Materials</a></li>
            <li><a href="/admin/settings"><i className="fas fa-shopping-cart"></i> Billing & Payments</a></li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="logout-button">
          <i className="fas fa-sign-out-alt"></i> 
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="main-title">Welcome, Admin!</h1>

        {/* Dashboard Widgets */}
        <div className="widget-grid">

          {/* Calendar Widget */}
          <div className="widget">
            <div className="calendar-container">
              <h3 className="calendar-title">Calendar</h3>
              <Calendar
                onChange={setDate}
                value={date}

              />
            </div>
          </div>

          {/* Project Status Widget */}
          <div className="widget project-status-widget">
            <h2 className="widget-title">📊 Project Status</h2>
            <div className="status-container">
              <p className="status-item">
                Active: <span className="status-number active">5</span>
              </p>
              <p className="status-item">
                Completed: <span className="status-number completed">12</span>
              </p>
              <p className="status-item">
                Pending: <span className="status-number pending">3</span>
              </p>
            </div>
          </div>

          {/* Inquiries Widget */}
          <div className="widget">
            <h2>📌 Recent Inquiries</h2>
            <ul className="inquiries-list">
              <li>🔹 Client A - New Project</li>
              <li>🔹 Client B - Pricing Request</li>
              <li>🔹 Client C - Follow-up</li>
            </ul>
          </div>
          
        </div>
        <div className="completed-projects">
            <h2 className="table-title">Completed projects and Reviews</h2>
            <table className="project-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Client Name</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {completedProjects.map((project, index) =>(
                  <tr key={index}>
                    <td>{project.name}</td>
                    <td>{project.client}</td>
                    <td>{project.review}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </main >
    </div >
  );
};

export default AdminDashboard;
