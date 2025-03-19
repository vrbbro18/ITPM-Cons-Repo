import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../assets/css/style.css"

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        const loadProject = async () => {
            try {
                const response = await fetch(`http://localhost:5000/projectDetails/${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                
                if (!response.ok) {
                    throw new Error("Failed to fetch project details");
                }

                const data = await response.json();
                setProject(data);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        };

        loadProject();
    }, [id]);

    if (!project) return <p>Loading project details...</p>;

    return (
        <div className="container">
            <h2>{project.name}</h2>
            <p><strong>Client:</strong> {project.client}</p>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Type:</strong> {project.type}</p>
            <p><strong>Details:</strong> {project.details}</p>
        </div>
    );
};

export default ProjectDetails;
