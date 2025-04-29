import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/style.css";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Login failed");

            localStorage.setItem("token", data.token);
           
            navigate("/construction-company-react-app/MainDashboard");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>email</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn">Login</button>
                    {/* <button type="button" className="signup-button" onClick={() => navigate("/construction-company-react-app/signUp")}>
                       Signup
                    </button> */}
                    
                    {/* <button type="button" className="forgot-password-button" onClick={() => navigate("/construction-company-react-app/forget-password")}>
                        Forget Password
                    </button> */}
                </form>
            </div>
        </div>
    );
};

export default Login;
