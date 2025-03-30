import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBar from "../Common/Sidebar";
import { generateCustomerPDF } from '../../../utils/pdfGenerator';
import './Styles/CustomerList.css';

const CustomerList = ({ serviceType }) => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (serviceType) queryParams.set('serviceType', serviceType);
        queryParams.set('search', searchTerm);
        const res = await axios.get(`http://localhost:5000/api/customer?${queryParams.toString()}`);
        setCustomers(res.data.data || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [serviceType, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:5000/api/customer/${id}`);
        setCustomers(prev => prev.filter(c => c._id !== id));
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleRowClick = (id) => {
    navigate(`/construction-company-react-app/editCustomer/${id}`);
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
      { header: 'Project Name', accessor: 'projectName' },
      { header: 'Budget', accessor: 'budget' }
    ];

    const doc = generateCustomerPDF(customers, columns, 'Customer List Report');
    doc.save('customer_list_report.pdf');
  };

  return (
    <div className="dashboard-container2">
      <SideBar />
      <div className="main-content2">
        <div className="header2">
          <h2>{serviceType ? `${serviceType} Projects` : 'All Projects'}</h2>
          <p><b>Total Projects: {customers.length}</b></p>
          <div className="search-bar-container2">
            <input
              type="text"
              className="search-bar"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* <button className="edit-btn" onClick={generateReport}>
              Generate Reports
            </button> */}
          </div>
        </div>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          showReport ? (
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
                    <th>Project Name</th>
                    <th>Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(customer => (
                    <tr key={customer._id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.serviceType}</td>
                      <td><span className={`status-badge ${customer.status}`}>{customer.status}</span></td>
                      <td>{customer.projectName || 'N/A'}</td>
                      <td>{customer.budget || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="edit-btn" onClick={downloadPDF}>Download PDF</button>
              <button className="delete-btn" onClick={() => setShowReport(false)}>Close</button>
            </div>
          ) : (
            <div className="customer-table">
              <table>
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Project Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  
                    <th>Budget</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Admin Notes</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length > 0 ? customers.map(customer => (
                    <tr key={customer._id} onClick={() => handleRowClick(customer._id)} style={{ cursor: 'pointer' }}>
                      <td>{customer.name}</td>
                      <td>{customer.projectName || 'N/A'}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      
                      <td>{customer.budget || 'N/A'}</td>
                      <td>{customer.startDate ? new Date(customer.startDate).toLocaleDateString() : 'N/A'}</td>
                      <td>{customer.endDate ? new Date(customer.endDate).toLocaleDateString() : 'N/A'}</td>
                      <td>{customer.adminNotes || 'N/A'}</td>
                      <td><span className={`status-badge ${customer.status}`}>{customer.status}</span></td>
                      <td onClick={e => e.stopPropagation()}>
                        <button className="edit-btn" onClick={() => navigate(`/construction-company-react-app/editCustomer/${customer._id}`)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(customer._id)}>Delete</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="11">No projects found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CustomerList;
