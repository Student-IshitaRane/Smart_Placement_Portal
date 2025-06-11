import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaClipboard } from "react-icons/fa";
import "./StudentNoticeBoard.css"; // We'll create this CSS file

function StudentNoticeBoard() {
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const res = await axios.get('http://localhost:5000/notices');
                setNotices(res.data.reverse()); // Show newest first
            } catch (err) {
                console.error(err);
                alert('Failed to fetch notices');
            }
        };

        fetchNotices();
    }, []);

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
                                <FaClipboard />
                            </span>
                            Student Notice Board
                        </h1>
                        <p className="noticeboard-subtitle">Important announcements from your institution</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="noticeboard-card"
                >
                    {notices.length === 0 ? (
                        <div className="empty-notices">
                            <p>No notices available at this time.</p>
                        </div>
                    ) : (
                        <div className="notices-list">
                            {notices.map((notice, index) => (
                                <motion.div
                                    key={index}
                                    className="notice-item"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="notice-content">{notice.content}</div>
                                    {notice.createdAt && (
                                        <div className="notice-date">
                                            {new Date(notice.createdAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default StudentNoticeBoard;