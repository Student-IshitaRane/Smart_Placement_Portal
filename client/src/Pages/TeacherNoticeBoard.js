import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaBullhorn } from "react-icons/fa"; // Professional icon
import "./TeacherNoticeBoard.css";

function TeacherNoticeBoard() {
    const [notices, setNotice] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!notices.trim()) {
            alert('Notice content cannot be empty');
            return;
        }
        
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:5000/notices', { content: notices });
            alert('Notice posted successfully!');
            setNotice("");
        } catch (err) {
            console.error('Error posting notice:', err);
            alert('Failed to post notice: ' + (err.response?.data || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="noticeboard-container">
            <div className="noticeboard-content">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="noticeboard-header"
                >
                    <div className="noticeboard-header-content">
                        <h1 className="noticeboard-title">
                            <span className="noticeboard-icon">
                                <FaBullhorn />
                            </span>
                            Teacher Notice Board
                        </h1>
                        <p className="noticeboard-subtitle">Share important announcements with students and staff</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="noticeboard-card"
                >
                    <h2 className="noticeboard-form-title">Post a New Notice</h2>
                    
                    <form onSubmit={handleSubmit} className="noticeboard-form">
                        <div className="form-group">
                            <textarea
                                className="noticeboard-textarea"
                                rows="6"
                                placeholder="Write your notice here..."
                                value={notices}
                                onChange={(e) => setNotice(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        
                        <motion.button
                            type="submit"
                            className="submit-button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="spinner" viewBox="0 0 50 50">
                                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                                    </svg>
                                    Posting...
                                </>
                            ) : (
                                "Post Notice"
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

export default TeacherNoticeBoard;