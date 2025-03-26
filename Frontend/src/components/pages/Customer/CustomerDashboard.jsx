import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../Common/Sidebar";
import { generateCustomerPDF } from '../../../utils/pdfGenerator';
import './Styles/CustomerDashboard.css';

const CustomerDashboard = () => {
  const [stats, setStats] = useState({ total: 0, stats: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, customersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/customer/stats'),
          axios.get(`http://localhost:5000/api/customer?search=${searchTerm}`)
        ]);

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`http://localhost:5000/api/customer/${id}`);
        const updatedCustomers = customers.filter(c => c._id !== id);
        setCustomers(updatedCustomers);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const generateReport = () => {
    setShowReport(true);
  };

  const downloadPDF = () => {
    const columns = [
      { header: 'Name', accessor: 'name' },
      { header: 'Email', accessor: 'email' },
      { header: 'Phone', accessor: 'phone' },
      { header: 'Service Type', accessor: 'serviceType' },
      { header: 'Status', accessor: 'status' },
      { header: 'Created At', accessor: 'createdAt' }
    ];

    const pdf = generateCustomerPDF(customers, columns, 'Customer Requests Report');
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
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
            <button className="edit-btn" onClick={generateReport}>
              Generate Reports
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading data...</div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card total-requests">
                <h3>Total Requests</h3>
                <p>{stats.total}</p>
              </div>
              {stats.stats?.map((stat) => (
                <div
                  key={stat.serviceType}
                  className={`stat-card ${stat.serviceType}-requests`}
                >
                  <h3>{stat.serviceType} Requests</h3>
                  <p>{stat.count}</p>
                </div>
              ))}
            </div>

            {showReport ? (
              <div className="report-section">
                <h3>Current Reports</h3>
                <p>Generated on: {new Date().toLocaleString()}</p>
                <table className="customer-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Service Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(customer => (
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
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="edit-btn" onClick={downloadPDF}>
                  Download PDF
                </button>
                <button className="delete-btn" onClick={() => setShowReport(false)}>
                  Close
                </button>
              </div>
            ) : (
              <div className="recent-requests">
                <h2>Recent Submissions</h2>
                <table className="customer-table">
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;