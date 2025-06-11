import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './AdminLogin.css';

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/AdminLogin", {
                email,
                password,
            });
            alert("🎉 Teacher Login Successful!");
            navigate("/admin");
        } catch (err) {
            console.error(err);
            alert("❌ Invalid Credentials!");
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h2>Teacher Login</h2>
                <p>Only for authorized faculty</p>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="admin-login-button">Login</button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;