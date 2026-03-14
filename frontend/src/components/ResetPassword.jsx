import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [successful, setSuccessful] = useState(false);

  const handleResetPassword = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    api.post("/auth/reset-password", { token, newPassword: password }).then(
      (response) => {
        setMessage(response.data.message || "Password successfully reset!");
        setSuccessful(true);
        setTimeout(() => navigate("/login"), 3000);
      },
      (err) => {
        setError(
          (err.response && err.response.data && err.response.data.message) ||
            "Invalid or expired token.",
        );
      },
    );
  };

  if (!token) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">
          Invalid password reset link. Token missing.
        </div>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="col-md-12 mt-5 mb-5">
      <div
        className="card card-container p-4 mx-auto"
        style={{ maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">Reset Password</h3>
        {!successful ? (
          <form onSubmit={handleResetPassword}>
            <div className="form-group mb-3">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <div className="form-group mb-4">
              <label>Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <div className="form-group d-grid mb-3">
              <button className="btn btn-primary btn-block">
                Reset Password
              </button>
            </div>
          </form>
        ) : null}

        {message && (
          <div className="alert alert-success mt-3" role="alert">
            {message}
          </div>
        )}
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
