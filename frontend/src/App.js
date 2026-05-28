import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Register from './pages/Register';

import StudentDashboard from './pages/student/Dashboard';
import MyCourses from './pages/student/MyCourses';
import Profile from './pages/student/Profile';

import InstructorDashboard from './pages/instructor/Dashboard';
import CreateCourse from './pages/instructor/CreateCourse';
import ManageCourses from './pages/instructor/ManageCourses';

import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import AdminCourses from './pages/admin/ManageCourses';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 140px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

          {/* Student */}
          <Route path="/student/dashboard" element={<PrivateRoute roles={['student']}><StudentDashboard /></PrivateRoute>} />
          <Route path="/student/my-courses" element={<PrivateRoute roles={['student']}><MyCourses /></PrivateRoute>} />
          <Route path="/student/profile" element={<PrivateRoute roles={['student','instructor','admin']}><Profile /></PrivateRoute>} />

          {/* Instructor */}
          <Route path="/instructor/dashboard" element={<PrivateRoute roles={['instructor']}><InstructorDashboard /></PrivateRoute>} />
          <Route path="/instructor/create-course" element={<PrivateRoute roles={['instructor']}><CreateCourse /></PrivateRoute>} />
          <Route path="/instructor/courses" element={<PrivateRoute roles={['instructor']}><ManageCourses /></PrivateRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><ManageUsers /></PrivateRoute>} />
          <Route path="/admin/courses" element={<PrivateRoute roles={['admin']}><AdminCourses /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
