import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const Login = ({ setCurrentUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");

    AuthService.login(username, password).then(
      () => {
        const user = AuthService.getCurrentUser();
        setCurrentUser(user);
        if (user.role === "ROLE_ADMIN") {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
      },
    );
  };

  return (
    <div className="col-md-12 mt-5">
      <div
        className="card card-container p-4 mx-auto"
        style={{ maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group d-grid">
            <button className="btn btn-primary btn-block">
              <span>Login</span>
            </button>
          </div>

          {message && (
            <div className="form-group mt-3">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}

          <div className="text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
