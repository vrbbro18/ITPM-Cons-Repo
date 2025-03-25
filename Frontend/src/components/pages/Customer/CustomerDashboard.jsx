import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get('http://localhost:5000/projects/stats');
      setStats(res.data);
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <div className="stats-card">
        <h3>Total Projects</h3>
        <p>{stats.totalProjects}</p>
        <Link to="/projects">View All</Link>
      </div>
      <div className="stats-card">
        <h3>Construction Projects</h3>
        <p>{stats.constructionCount}</p>
        <Link to="/projects/construction">View Construction</Link>
      </div>
      <div className="stats-card">
        <h3>Consulting Projects</h3>
        <p>{stats.consultingCount}</p>
        <Link to="/projects/consulting">View Consulting</Link>
      </div>
    </div>
  );
};

export default CustomerDashboard;