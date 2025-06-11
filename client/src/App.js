import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Aceboard from './Pages/Aceboard';
import Leetcode from './Pages/Leetcode';
import Gfg from './Pages/Gfg';
import Codeforces from './Pages/Codeforces';
import Leaderboard from './Pages/Home';
import StudentDashboardWrapper from './Pages/StudentDashboardWrapper';
import AdminDashboard from './Pages/AdminDashboard';
import AdminMainPage from './Pages/AdminMainPage';
import MainPage from './Pages/MainPage';
import StudentHistory from './Pages/StudentHistory';
import AddCompany from './Pages/AddCompany';
import RegisterPage from './Pages/RegisterPage';
import AuthLandingPage from './Pages/AuthLandingPage'; // ✅ New
import ManageCompanies from './Pages/ManageCompanies';
import StudentNoticeBoard from './Pages/StudentNoticeBoard';
import TeacherNoticeBoard from './Pages/TeacherNoticeBoard';
import StudentList from './Pages/StudentList';
import AdminRegister from './Pages/AdminRegister';
import AdminLogin from './Pages/AdminLogin';
import CompaniesList from './Pages/CompaniesList';
import GenerateReport from './Pages/GenerateReport';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('studentId')) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing page with Login/Register options */}
          <Route path="/" element={<AuthLandingPage />} />

          {/* Auth Routes */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Routes */}
          <Route path="/main" element={isAuthenticated ? <MainPage /> : <AuthLandingPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/aceboard" element={<Aceboard />} />
          <Route path="/leetcode" element={<Leetcode />} />
          <Route path="/gfg" element={<Gfg />} />
          <Route path="/codeforces" element={<Codeforces />} />
          <Route exact path="/student" element={<StudentDashboardWrapper />} />
          <Route path="/student/history/:studentId" element={<StudentHistory />} />
          <Route path="/studentNoticeBoard" element={<StudentNoticeBoard />} />
          <Route path="/CompaniesList" element={<CompaniesList/>}/>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminMainPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-company" element={<AddCompany />} />
          <Route path="/admin/companies" element={<ManageCompanies />} />
          <Route path="/admin/noticeBoard" element={<TeacherNoticeBoard />} />
          <Route path="/StudentList" element={<StudentList />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/AdminRegister" element={<AdminRegister />} />
          <Route path="/admin/generate-report" element={<GenerateReport />} /> {/* Add the new route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
