import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectType: 'Residential',
    status: 'Pending',
    startDate: '',
    endDate: '',
    budget: 0,
    adminNotes: ''
  });

  useEffect(() => {
    const fetchProject = async () => {
      const res = await axios.get(`http://localhost:5000/projects/${id}`);
      setFormData({
        projectType: res.data.projectType,
        status: res.data.status,
        startDate: res.data.startDate?.split('T')[0] || '',
        endDate: res.data.endDate?.split('T')[0] || '',
        budget: res.data.budget || 0,
        adminNotes: res.data.adminNotes || ''
      });
    };
    fetchProject();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/projects/${id}`, formData);
      alert('Project updated successfully!');
      navigate('/projects');
    } catch (error) {
      console.error(error);
      alert('Error updating project');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="edit-project-form">
      <h2>Edit Project Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Project Type:</label>
          <select
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Renovation">Renovation</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Budget:</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Admin Notes:</label>
          <textarea
            name="adminNotes"
            value={formData.adminNotes}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <button type="submit">Update Project</button>
        <button type="button" onClick={() => navigate('/projects')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProject;