import React from 'react';
import StudentDashboard from './StudentDashboard';

const StudentDashboardWrapper = () => {
  const studentId = localStorage.getItem('studentId');

  if (!studentId) return <p>Please login first.</p>;

  return <StudentDashboard studentId={studentId} />;
};

export default StudentDashboardWrapper;
