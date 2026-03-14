import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const Navbar = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <Link to={"/"} className="navbar-brand ms-3">
        EMS
      </Link>
      <div className="navbar-nav mr-auto">
        {currentUser && (
          <li className="nav-item">
            <Link to={"/profile"} className="nav-link">
              My Profile
            </Link>
          </li>
        )}

        {currentUser && currentUser.role !== "ROLE_ADMIN" && (
          <li className="nav-item">
            <Link to={"/attendance"} className="nav-link">
              Attendance & Leaves
            </Link>
          </li>
        )}

        {currentUser && currentUser.role === "ROLE_ADMIN" && (
          <>
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Admin Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/admin-leaves"} className="nav-link">
                Employee Leaves
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/admin-attendance"} className="nav-link">
                Employee Attendance
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/admin-messages"} className="nav-link">
                User Complaints
              </Link>
            </li>
          </>
        )}
        {currentUser && currentUser.role !== "ROLE_ADMIN" && (
          <li className="nav-item">
            <Link to={"/contact-admin"} className="nav-link">
              Contact Admin
            </Link>
          </li>
        )}
      </div>

      <div className="navbar-nav ms-auto me-3">
        {currentUser && (
          <li className="nav-item">
            <button className="nav-link btn btn-link" onClick={logOut}>
              Logout ({currentUser.username})
            </button>
          </li>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
