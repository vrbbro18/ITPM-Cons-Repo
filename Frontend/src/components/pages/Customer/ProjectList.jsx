import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';


const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const { serviceType } = useParams();

  useEffect(() => {
    const fetchProjects = async () => {
      const url = serviceType 
        ? `http://localhost:5000/projects?serviceType=${serviceType}`
        : 'http://localhost:5000/projects';
      
      const res = await axios.get(url);
      setProjects(res.data);
    };
    fetchProjects();
  }, [serviceType]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const url = serviceType 
          ? `/api/customers?serviceType=${serviceType}`
          : '/api/customers';
        
        const response = await axios.get(url);
        setCustomers(response.data.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    
    fetchCustomers();
  }, [serviceType]);

  return (
    <div>
      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project._id} className="project-card">
            <h3>{project.customerName}</h3>
            <p>Service: {project.serviceType}</p>
            <Link to={`/projects/edit/${project._id}`}>Edit</Link>
          </div>
        ))
      ) : (
        <p>No projects found.</p>
      )}
      <button 
  onClick={async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await axios.delete(`http://localhost:5000/projects/${project._id}`);
      // Refresh projects list
      fetchProjects();
    }
  }}
>
  Delete
</button>
    </div>
  );
};

export default ProjectList;