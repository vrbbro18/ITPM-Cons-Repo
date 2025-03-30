import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import '../../../assets/css/project.css';

const ProjectDashboard = () => {
    const [viewMode, setViewMode] = useState('grid');

    const monthlyData = [
        { month: 'Jan', projects: 5, revenue: 25000 },
        { month: 'Feb', projects: 8, revenue: 40000 },
        { month: 'Mar', projects: 12, revenue: 62000 },
        { month: 'Apr', projects: 7, revenue: 38000 },
        { month: 'May', projects: 15, revenue: 75000 },
        { month: 'Jun', projects: 10, revenue: 50000 },
        { month: 'Jul', projects: 18, revenue: 90000 },
        { month: 'Aug', projects: 20, revenue: 100000 },
        { month: 'Sep', projects: 14, revenue: 70000 },
        { month: 'Oct', projects: 17, revenue: 85000 },
        { month: 'Nov', projects: 11, revenue: 55000 },
        { month: 'Dec', projects: 13, revenue: 65000 },
    ];

    const projectTypes = [
        { name: 'Residential', value: 42 },
        { name: 'Commercial', value: 28 },
        { name: 'Industrial', value: 15 },
        { name: 'Infrastructure', value: 15 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const recentProjects = [
        { id: 1, name: 'City Center Tower', client: 'Metro Developments', progress: 75, status: 'On Track' },
        { id: 2, name: 'Riverside Apartments', client: 'River Homes Inc.', progress: 45, status: 'Delayed' },
        { id: 3, name: 'Highway Bridge Repair', client: 'State Transport Dept.', progress: 90, status: 'On Track' },
        { id: 4, name: 'Tech Park Phase 2', client: 'TechSpace Solutions', progress: 30, status: 'On Track' },
    ];

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

    const getStatusColor = (status) => {
        switch(status) {
            case 'On Track': return 'bg-success';
            case 'Delayed': return 'bg-warning';
            case 'At Risk': return 'bg-danger';
            default: return 'bg-primary';
        }
    };

    return (
        <div className="dashboard-container">
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
                    <i className="fas fa-sign-out-alt"></i> Logout
                </div>
            </aside>

            <main className="dashboard-content">
                <header className="dashboard-header">
                    <div>
                        <h1>Project Dashboard</h1>
                        <p className="dashboard-subtitle">Welcome back! Here's what's happening with your projects</p>
                    </div>
                    <div className="view-toggle">
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
                    <div className="stat-cards">
                        <div className="stat-card">
                            <div className="stat-icon active">
                                <i className="fas fa-project-diagram"></i>
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Active Projects</p>
                                <h3 className="stat-value">12</h3>
                                <div className="stat-trend positive">
                                    <i className="fas fa-arrow-up"></i>
                                    <span>+8% from last month</span>
                                </div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon completed">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Completed Tasks</p>
                                <h3 className="stat-value">87</h3>
                                <div className="stat-trend positive">
                                    <i className="fas fa-arrow-up"></i>
                                    <span>+12% from last week</span>
                                </div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon pending">
                                <i className="fas fa-exclamation-circle"></i>
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Pending Approvals</p>
                                <h3 className="stat-value">5</h3>
                                <div className="stat-trend negative">
                                    <i className="fas fa-arrow-up"></i>
                                    <span>+2 since yesterday</span>
                                </div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon deadline">
                                <i className="fas fa-calendar-alt"></i>
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Upcoming Deadlines</p>
                                <h3 className="stat-value">3</h3>
                                <div className="stat-trend neutral">
                                    <i className="fas fa-clock"></i>
                                    <span>Next: 2 days</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="chart-section">
                        <div className="chart-card large">
                            <div className="chart-header">
                                <h3 className="chart-title">Projects Completed (2024)</h3>
                                <div className="chart-filter">
                                    <span>Monthly</span>
                                    <i className="fas fa-chevron-down"></i>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <Bar dataKey="projects" fill="#4F46E5" barSize={40} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {/* <div className="chart-card">
                            <div className="chart-header">
                                <h3 className="chart-title">Project Types</h3>
                                <button className="chart-options">
                                    <i className="fas fa-ellipsis-h"></i>
                                </button>
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={projectTypes}
                                        cx="50%"
                                        cy="50%"
                                        activeShape={renderActiveShape}
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {projectTypes.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div> */}
                    </div>

                    <div className="project-table-section">
                        <div className="section-header">
                            <h3 className="section-title">Recent Projects</h3>
                            <a href="#" className="view-all">View All</a>
                        </div>
                        <div className="table-responsive">
                            <table className="project-table">
                                <thead>
                                    <tr>
                                        <th>Project Name</th>
                                        <th>Client</th>
                                        <th>Progress</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentProjects.map((project) => (
                                        <tr key={project.id}>
                                            <td>
                                                <div className="project-name">{project.name}</div>
                                            </td>
                                            <td>
                                                <div className="client-name">{project.client}</div>
                                            </td>
                                            <td>
                                                <div className="progress-bar-container">
                                                    <div 
                                                        className="progress-bar" 
                                                        style={{ width: `${project.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="progress-text">{project.progress}%</span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${getStatusColor(project.status)}`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td>
                                                <a href="#" className="action-link">View Details</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bottom-section">
                        <div className="chart-card">
                            <div className="chart-header">
                                <h3 className="chart-title">Revenue Trends</h3>
                                <div className="chart-filter">
                                    <span>This Year</span>
                                    <i className="fas fa-chevron-down"></i>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Line 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#10B981" 
                                        strokeWidth={3}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="task-card">
                            <div className="task-header">
                                <h3 className="task-title">Upcoming Tasks</h3>
                                <a href="#" className="view-calendar">View Calendar</a>
                            </div>
                            <div className="task-list">
                                <div className="task-item today">
                                    <div className="task-icon">
                                        <i className="fas fa-calendar-day"></i>
                                    </div>
                                    <div className="task-info">
                                        <p className="task-name">Site Inspection - Tech Park</p>
                                        <p className="task-date">March 31, 9:00 AM</p>
                                    </div>
                                    <span className="task-badge today">Today</span>
                                </div>
                                <div className="task-item">
                                    <div className="task-icon">
                                        <i className="fas fa-calendar-day"></i>
                                    </div>
                                    <div className="task-info">
                                        <p className="task-name">Client Meeting - Riverside</p>
                                        <p className="task-date">April 1, 2:00 PM</p>
                                    </div>
                                    <span className="task-badge">Tomorrow</span>
                                </div>
                                <div className="task-item">
                                    <div className="task-icon">
                                        <i className="fas fa-calendar-day"></i>
                                    </div>
                                    <div className="task-info">
                                        <p className="task-name">Material Delivery - City Center</p>
                                        <p className="task-date">April 2, 10:00 AM</p>
                                    </div>
                                    <span className="task-badge">In 3 days</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectDashboard;