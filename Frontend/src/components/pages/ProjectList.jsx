import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/style.css"
import "../../assets/css/pages.css"


const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    if (loading) return <p>Loading projects...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
    if (projects.length === 0) return <p>No projects available.</p>;

    return (
        <div>
            {/* <SecondaryHeader /> */}
            <div className="container">
                <h2>Manager Dashboard - Projects</h2>
                <table className="project-table">
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
                        {projects.map((project) => (
                            <tr key={project._id}>
                                <td>{project.name}</td>
                                <td>{project.client}</td>
                                <td>{project.status}</td>
                                <td>{project.type}</td>
                                <td>
                                    <button
                                        onClick={() => navigate(`/construction-company-react-app/projectDetails/${project._id}`)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectList;
