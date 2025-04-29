import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../Common/Sidebar";
import './Styles/CustomerDashboard.css'; // Keep this for other styles if needed


const CustomerDashboard = () => {
  const [stats, setStats] = useState({ total: 0, stats: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsRes = await axios.get('http://localhost:5000/api/customer/stats');

        const statsData = statsRes.data.data;
        const transformedStats = {
          total: statsData.totalCustomers,
          stats: [
            { serviceType: 'Construction', count: statsData.constructionCount },
            { serviceType: 'Consulting', count: statsData.consultingCount },
          ],
        };

        setStats(transformedStats);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
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

  return (
    <div className="cdashboard-container">
      <Sidebar />
      <div
        className="cmain-content"
       
      >
        <div className="ccontent-wrapper">
          <div className="cheader">
            <h1>For your Dream Projects</h1>

          </div>
          

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading data...</div>
          ) : (
            <div className="stats-grid">
              <div className="stat-card total-requests">
                <h3>Total Requests</h3>
                <p>{stats.total}</p>
              </div>
              {stats.stats?.map((stat) => (
                <div
                  key={stat.serviceType}
                  className={`stat-card ${stat.serviceType.toLowerCase()}-requests`}
                  onClick={
                    stat.serviceType === 'Construction'
                      ? handleConstructionClick
                      : handleConsultingClick
                  }
                >
                  <h3>{stat.serviceType} Requests</h3>
                  <p>{stat.count}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;