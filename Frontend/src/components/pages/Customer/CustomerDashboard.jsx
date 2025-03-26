import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../Common/Sidebar";

const CustomerDashboard = () => {
  const [stats, setStats] = useState({ total: 0, stats: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, customersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/customer/stats'),
          axios.get(`http://localhost:5000/api/customer?search=${searchTerm}`)
        ]);

        // Transform stats data to match frontend expectations
        const statsData = statsRes.data.data;
        const transformedStats = {
          total: statsData.totalCustomers,
          stats: [
            { serviceType: 'construction', count: statsData.constructionCount },
            { serviceType: 'consulting', count: statsData.consultingCount }
          ]
        };

        setStats(transformedStats);
        setCustomers(customersRes.data.data || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchTerm]);

  

  const generateReport = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Service Type', 'Status', 'Created At'],
      ...customers.map(c => [
        c.name,
        c.email,
        c.phone,
        c.serviceType,
        c.status,
        new Date(c.createdAt).toLocaleDateString()
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer-report.csv';
    a.click();
  };

  // Add this inside your CustomerDashboard component
const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this customer?')) {
    try {
      await axios.delete(`http://localhost:5000/api/customer/${id}`);
      // Refresh data after deletion
      const updatedCustomers = customers.filter(c => c._id !== id);
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error('Delete error:', error);
    }
  }
};

return (
  <div className="dashboard-container">
    <Sidebar />
    
    <div className="main-content">
      <div className="header">
        <h1>Customer Requests</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={generateReport} className="report-btn">
            Generate Report
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading data...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Requests</h3>
              <p>{stats.total}</p>
              <Link to="/customerList">View All</Link>
            </div>
            {stats.stats?.map((stat) => (
              <div key={stat.serviceType} className="stat-card">
                <h3>{stat.serviceType} Requests</h3>
                <p>{stat.count}</p>
                <Link to={`/customerList/${stat.serviceType}`}>
                  View {stat.serviceType}
                </Link>
              </div>
            ))}
          </div>

          <div className="recent-requests">
            <h2>Recent Submissions</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Service Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map(customer => (
                    <tr key={customer._id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.serviceType}</td>
                      <td>
                        <span className={`status-badge ${customer.status}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td>
                      <Link 
  to={`/construction-company-react-app/editCustomer/${customer._id}`}
  className="edit-btn"
>
  Edit
</Link>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(customer._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No customers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  </div>
);
};

export default CustomerDashboard;