import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import AuthService from "./services/auth.service";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ContactAdmin from "./components/ContactAdmin";
import AdminMessages from "./components/AdminMessages";
import AttendanceLeaveUser from "./components/AttendanceLeaveUser";
import AdminLeaves from "./components/AdminLeaves";
import AdminAttendance from "./components/AdminAttendance";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />

        <div className="container mt-3">
          <Routes>
            <Route
              path="/"
              element={
                <Navigate
                  to={
                    currentUser
                      ? currentUser.role === "ROLE_ADMIN"
                        ? "/admin"
                        : "/profile"
                      : "/login"
                  }
                />
              }
            />

            <Route
              path="/login"
              element={<Login setCurrentUser={setCurrentUser} />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/profile"
              element={
                currentUser ? <UserDashboard /> : <Navigate to="/login" />
              }
            />

            <Route
              path="/admin"
              element={
                currentUser && currentUser.role === "ROLE_ADMIN" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to={currentUser ? "/profile" : "/login"} />
                )
              }
            />

            <Route
              path="/contact-admin"
              element={
                currentUser && currentUser.role !== "ROLE_ADMIN" ? (
                  <ContactAdmin />
                ) : (
                  <Navigate to={currentUser ? "/profile" : "/login"} />
                )
              }
            />

            <Route
              path="/admin-messages"
              element={
                currentUser && currentUser.role === "ROLE_ADMIN" ? (
                  <AdminMessages />
                ) : (
                  <Navigate to={currentUser ? "/profile" : "/login"} />
                )
              }
            />

            <Route
              path="/attendance"
              element={
                currentUser && currentUser.role !== "ROLE_ADMIN" ? (
                  <AttendanceLeaveUser />
                ) : (
                  <Navigate to={currentUser ? "/profile" : "/login"} />
                )
              }
            />

            <Route
              path="/admin-leaves"
              element={
                currentUser && currentUser.role === "ROLE_ADMIN" ? (
                  <AdminLeaves />
                ) : (
                  <Navigate to={currentUser ? "/profile" : "/login"} />
                )
              }
            />

            <Route
              path="/admin-attendance"
              element={
                currentUser && currentUser.role === "ROLE_ADMIN" ? (
                  <AdminAttendance />
                ) : (
                  <Navigate to={currentUser ? "/profile" : "/login"} />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
