import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Sidebar from "../Common/Sidebar";
import { generateCustomerPDF } from '../../../utils/pdfGenerator';
import './Styles/CustomerDashboard.css';

const CustomerDashboard = () => {
  const [stats, setStats] = useState({ total: 0, stats: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showReport, setShowReport] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsRes = await axios.get('http://localhost:5000/api/customer/stats');
        const statsData = statsRes.data.data;
        const transformedStats = {
          total: statsData.totalCustomers || 0,
          stats: [
            { serviceType: 'Construction', count: statsData.constructionCount || 0 },
            { serviceType: 'Consulting', count: statsData.consultingCount || 0 },
          ],
        };
        setStats(transformedStats);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleConstructionClick = () => {
    navigate('/construction-company-react-app/constructions');
  };

  const handleConsultingClick = () => {
    navigate('/construction-company-react-app/consulting');
  };

  const filteredStats = stats.stats.filter(stat =>
    stat.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = [
    {
      name: 'Total',
      count: stats.total,
    },
    ...filteredStats.map(stat => ({
      name: stat.serviceType,
      count: stat.count,
    })),
  ];

  const pieData = filteredStats.map(stat => ({
    name: stat.serviceType,
    value: stat.count,
  }));

  const COLORS = ['#fd5d14', '#fdbe33'];

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <text x={cx} y={cy - 20} textAnchor="middle" fill="#333" className="text-sm">
          {payload.name}
        </text>
      </g>
    );
  };

  const generateReport = () => {
    if (filteredStats.length === 0) {
      alert('No data available to generate a report.');
      return;
    }
    setShowReport(true);
  };

  const downloadPDF = () => {
    if (filteredStats.length === 0) {
      alert('No data available to download as PDF.');
      return;
    }
    try {
      console.log('Generating PDF with data:', filteredStats);
      const columns = [
        { header: 'Service Type', accessor: 'serviceType' },
        { header: 'Count', accessor: 'count' },
      ];
      const doc = generateCustomerPDF(filteredStats, columns, 'Customer Requests Report');
      doc.save('customer_requests_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please check if all dependencies are installed and try again.');
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Customer Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back! Manage your project requests here <span className="total-count">{stats.total}</span></p>
          </div>
          <div className="view-toggle">
            <div className="search-bar-container">
              <input
                type="text"
                className="search-bar"
                placeholder="Search service types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="generate-report-btn" onClick={generateReport}>
                <i className="fas fa-file-alt"></i> Generate Report
              </button>
            </div>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <i className="fas fa-th"></i>
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <i className="fas fa-list"></i>
            </button>
            <div className="user-avatar">
              <span>JD</span>
            </div>
          </div>
        </header>

        <div className="dashboard-content-inner">
          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading data...</div>
          ) : (
            <>
              {showReport ? (
                <div className="report-section">
                  <h3>Customer Requests Report</h3>
                  <p>Generated on: {new Date().toLocaleString()}</p>
                  <p>Total Requests: {filteredStats.reduce((sum, stat) => sum + stat.count, 0)}</p>
                  <div className="table-responsive">
                    <table className="project-table">
                      <thead>
                        <tr>
                          <th>Service Type</th>
                          <th>Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStats.length > 0 ? filteredStats.map((stat) => (
                          <tr key={stat.serviceType}>
                            <td><div className="project-name">{stat.serviceType}</div></td>
                            <td><div className="client-name">{stat.count}</div></td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="2">No data found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="report-actions">
                    <button className="download-pdf-btn" onClick={downloadPDF}>
                      <i className="fas fa-download"></i> Download PDF
                    </button>
                    <button className="close-report-btn" onClick={() => setShowReport(false)}>
                      <i className="fas fa-times"></i> Close
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="stat-cards">
                    <div className="stat-card total-requests">
                      <div className="stat-icon total">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="stat-info">
                        <p className="stat-label">Total Requests</p>
                        <h3 className="stat-value">{stats.total}</h3>
                      </div>
                    </div>
                    {filteredStats.map((stat) => (
                      <div
                        key={stat.serviceType}
                        className={`stat-card ${stat.serviceType.toLowerCase()}-requests`}
                        onClick={
                          stat.serviceType === 'Construction'
                            ? handleConstructionClick
                            : handleConsultingClick
                        }
                      >
                        <div className="stat-icon">
                          <i className={`fas ${stat.serviceType === 'Construction' ? 'fa-building' : 'fa-comments'}`}></i>
                        </div>
                        <div className="stat-info">
                          <p className="stat-label">{stat.serviceType} Requests</p>
                          <h3 className="stat-value">{stat.count}</h3>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="chart-section">
                    <div className="chart-card large">
                      <div className="chart-header">
                        <h3 className="chart-title">Request Counts</h3>
                        <div className="chart-filter">
                          <span>All Time</span>
                          <i className="fas fa-chevron-down"></i>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              borderRadius: '8px',
                              border: 'none',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                          />
                          <Bar dataKey="count" fill="#fd5d14" barSize={40} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="chart-card">
                      <div className="chart-header">
                        <h3 className="chart-title">Request Distribution</h3>
                        <button className="chart-options">
                          <i className="fas fa-ellipsis-h"></i>
                        </button>
                      </div>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            activeShape={renderActiveShape}
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="project-table-section">
                    <div className="section-header">
                      <h3 className="section-title">Service Requests Summary</h3>
                      <a href="#" className="view-all">View All</a>
                    </div>
                    <div className="table-responsive">
                      <table className="project-table">
                        <thead>
                          <tr>
                            <th>Service Type</th>
                            <th>Count</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStats.length > 0 ? filteredStats.map((stat) => (
                            <tr key={stat.serviceType}>
                              <td>
                                <div className="project-name">{stat.serviceType}</div>
                              </td>
                              <td>
                                <div className="client-name">{stat.count}</div>
                              </td>
                              <td>
                                <a
                                  href="#"
                                  className="action-link"
                                  onClick={
                                    stat.serviceType === 'Construction'
                                      ? handleConstructionClick
                                      : handleConsultingClick
                                  }
                                >
                                  View Details
                                </a>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan="3">No data found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;