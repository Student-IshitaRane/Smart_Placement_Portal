import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './AdminRegister.css';

function AdminRegister() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:5000/AdminRegister', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            alert('🎉 Admin Registration Successful!');
            setFormData({
                name: "",
                email: "",
                phone: "",
                department: "",
                password: "",
            });
            navigate('/admin');
        } catch (err) {
            console.error(err);
            alert('❌ Registration Failed!');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Admin Registration</h2>
                <p>Register as a TNP Cell Member</p>

                <form onSubmit={handleSubmit}>
                    {[
                        { name: 'name', label: 'Name' },
                        { name: 'email', label: 'Email', type: 'email' },
                        { name: 'phone', label: 'Phone', type: 'tel' },
                    ].map((field) => (
                        <div key={field.name}>
                            <label>{field.label}</label>
                            <input
                                type={field.type || 'text'}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}

                    <div>
                        <label>Department</label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Electronics and Telecommunication">Electronics and Telecommunication</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Instrumentation Engineering">Instrumentation Engineering</option>
                        </select>
                    </div>

                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="register-button">
                        Register as TNP cell member
                    </button>
                </form>

                <p className="signup-text">
                    Already have an account? <Link to="/AdminLogin">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default AdminRegister;