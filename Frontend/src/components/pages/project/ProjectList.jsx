import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./projectss.css"

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const response = await fetch("http://localhost:5000/projects", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch projects");
                }

                const data = await response.json();
                setProjects(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    // Count projects by status
    const getStatusCounts = () => {
        let completed = 0;
        let inProgress = 0;
        let pending = 0;

        projects.forEach(project => {
            if (project.status === "Completed") completed++;
            else if (project.status === "In Progress") inProgress++;
            else pending++;
        });

        return { completed, inProgress, pending, total: projects.length };
    };

    const { completed, inProgress, pending, total } = getStatusCounts();

    // Filter projects based on search and status filter
    const filteredProjects = projects.filter(project => {
        const matchesSearch = (project.projectName || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || project.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleAddNewProject = () => {
        navigate("/construction-company-react-app/addProject");
    };

    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div>
            <aside className="sidebar">
                <h2 className="sidebar-title">Project & Services</h2>
                <nav>
                    <ul className="sidebar-menu">
                        <li><a href="/construction-company-react-app/ProjectDashboard"><i className="fas fa-home"></i>Home</a></li>
                        <li><a href="/construction-company-react-app/projects"><i className="fas fa-user"></i>Construction</a></li>
                        <li><a href="/construction-company-react-app/MaterialForm"><i className="fas fa-tasks"></i> Consulting & Services</a></li>
                        <li><a href="/construction-company-react-app/MaterialForm"><i className="fas fa-envelope"></i> Reports & Analytics</a></li>
                    </ul>
                </nav>
                <div className="logout-button">
                    <i className="fas fa-sign-out-alt"></i>
                </div>
            </aside>
            
            <div className="project-list-container">
                <div className="dashboard-header">
                    <h2>Manager Dashboard - Projects</h2>
                    {/* <button className="add-project-btn" onClick={handleAddNewProject}>
                        <i className="fas fa-plus"></i> Add New Project
                    </button> */}
                </div>
                
                {/* Project Summary Cards */}
                <div className="project-summary">
                    <div className="summary-card total">
                        <div className="card-icon"><i className="fas fa-clipboard-list"></i></div>
                        <div className="card-content">
                            <h3>Total Projects</h3>
                            <p>{total}</p>
                        </div>
                    </div>
                    <div className="summary-card completed">
                        <div className="card-icon"><i className="fas fa-check-circle"></i></div>
                        <div className="card-content">
                            <h3>Completed</h3>
                            <p>{completed}</p>
                        </div>
                    </div>
                    <div className="summary-card in-progress">
                        <div className="card-icon"><i className="fas fa-spinner"></i></div>
                        <div className="card-content">
                            <h3>In Progress</h3>
                            <p>{inProgress}</p>
                        </div>
                    </div>
                    <div className="summary-card pending">
                        <div className="card-icon"><i className="fas fa-clock"></i></div>
                        <div className="card-content">
                            <h3>Pending</h3>
                            <p>{pending}</p>
                        </div>
                    </div>
                </div>
                
                {/* Search and Filter Controls */}
                <div className="project-controls">
                    <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-controls">
                        <label>Filter by status:</label>
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Projects</option>
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                </div>
                
                {loading ? (
                    <div className="loading-indicator">
                        <i className="fas fa-spinner fa-spin"></i>
                        <p>Loading projects...</p>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-folder-open"></i>
                        <p>No projects found. Try adjusting your filters.</p>
                    </div>
                ) : (
                    <table className="project-tables">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Client</th>
                                <th>Status</th>
                                <th>Type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody> 
                            {filteredProjects.map((project) => (
                                <tr key={project._id}>
                                    <td>{project.name}</td>
                                    <td>{project.projectName}</td>
                                    <td>
                                        <span className={`status-badge ${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td>{project.serviceType}</td>
                                    <td>
                                        <button className="view"
                                            onClick={() => navigate(`/construction-company-react-app/projectDetails/${project._id}`)}
                                        >
                                            <i className="fas fa-eye"></i> View
                                        </button>
                                        <button className="delete"
                                            onClick={() => navigate(`/construction-company-react-app/projectDetails/${project._id}`)}
                                        >
                                            <i className="fas fa-trash-alt"></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
                {/* Pagination Component (simplified) */}
                <div className="pagination">
                    <button disabled><i className="fas fa-chevron-left"></i></button>
                    <button className="active">1</button>
                    <button>2</button>
                    <button>3</button>
                    <button><i className="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
    );
};

export default ProjectList;