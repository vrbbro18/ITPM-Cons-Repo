import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../Common/Sidebar";

const CustomerList = () => {
  const { serviceType } = useParams();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/customer?serviceType=${serviceType || ''}&search=${searchTerm}`);
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
        await axios.delete(`/api/customer/${id}`);
        setCustomers(prev => prev.filter(c => c._id !== id));
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
          <h2>{serviceType ? `${serviceType} Projects` : 'All Projects'}</h2>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="customer-list">
            {customers.map(customer => (
              <div key={customer._id} className="customer-card">
                <div className="card-header">
                  <h3>{customer.name}</h3>
                  <span className={`status ${customer.status}`}>
                    {customer.status}
                  </span>
                </div>
                <div className="card-body">
                  <p>Email: {customer.email}</p>
                  <p>Phone: {customer.phone}</p>
                  <p>Service: {customer.serviceType}</p>
                  {customer.projectName && <p>Project: {customer.projectName}</p>}
                </div>
                <div className="card-actions">
                <button 
  className="edit-btn"
  onClick={() => navigate(`/construction-company-react-app/editCustomer/${customer._id}`)}
>
  Edit
</button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(customer._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;