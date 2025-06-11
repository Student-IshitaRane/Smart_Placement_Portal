import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./StudentList.css";

function StudentList() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/api/users/StudentList")
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="studentlist-container">
            <div className="studentlist-content">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="studentlist-header"
                >
                    <div className="studentlist-header-content">
                        <h1 className="studentlist-title">
                            <span className="studentlist-logo">👨‍🎓</span>
                            Student Placement Records
                        </h1>
                        <p className="studentlist-subtitle">Track student placement status and academic performance</p>
                    </div>
                    <div className="studentlist-stats">
                        <div className="stat-card">
                            <div className="stat-value">{users.length}</div>
                            <div className="stat-label">Students</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{users.filter(u => u.placed).length}</div>
                            <div className="stat-label">Placed</div>
                        </div>
                    </div>
                </motion.div>

                <div className="search-controls">
                    <div className="search-container">
                        <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by Name or Roll No..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-wrapper">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="studentlist-card"
                    >
                        <table className="studentlist-table">
                            <thead>
                                <tr>
                                    <th className="name-header">Name</th>
                                    <th className="rollno-header">Roll No.</th>
                                    <th className="branch-header">Branch</th>
                                    <th className="year-header">Year</th>
                                    <th className="cgpa-header">CGPA</th>
                                    <th className="score-header">Coding Score</th>
                                    <th className="placement-header">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <motion.tr 
                                        key={user._id || user.rollNo}
                                        className={`user-row ${user.placed ? 'placed-row' : 'not-placed-row'}`}
                                        whileHover={{ 
                                            backgroundColor: 'rgba(74, 144, 226, 0.05)',
                                            transition: { duration: 0.2 }
                                        }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <td className="name-cell">
                                            <div className="user-info">
                                                <span className="user-name">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="rollno-cell">{user.rollNo}</td>
                                        <td className="branch-cell">{user.branch}</td>
                                        <td className="year-cell">Year {user.year}</td>
                                        <td className="cgpa-cell">
                                            <div className="cgpa-badge">
                                                {user.cgpa}
                                            </div>
                                        </td>
                                        <td className="score-cell">
                                            <div className="score-progress">
                                                {user.score || 0}
                                                <div className="progress-bar">
                                                    <div 
                                                        className="progress-fill" 
                                                        style={{ width: `${Math.min(100, (user.score || 0) / 1000 * 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="placement-cell">
                                            <div className={`placement-status ${user.placed ? 'placed' : 'not-placed'}`}>
                                                {user.placed ? (
                                                    <>
                                                        <svg className="placement-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                        Placed
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="placement-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                        Not Placed
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="empty-state">
                                <svg className="empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.172 16.242L12 13.414L14.828 16.242L16.242 14.828L13.414 12L16.242 9.172L14.828 7.758L12 10.586L9.172 7.758L7.758 9.172L10.586 12L7.758 14.828L9.172 16.242ZM12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22Z" fill="currentColor"/>
                                </svg>
                                <h3>No students found</h3>
                                <p>Try adjusting your search query</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default StudentList;