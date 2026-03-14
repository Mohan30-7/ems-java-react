import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    api.post("/auth/forgot-password", { email }).then(
      (response) => {
        setMessage(
          response.data.message ||
            "If the email exists, a reset link will be sent.",
        );
      },
      (err) => {
        setError(
          (err.response && err.response.data && err.response.data.message) ||
            "Error sending reset link.",
        );
      },
    );
  };

  return (
    <div className="col-md-12 mt-5 mb-5">
      <div
        className="card card-container p-4 mx-auto"
        style={{ maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">Forgot Password</h3>
        <form onSubmit={handleForgotPassword}>
          <div className="form-group mb-3">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group d-grid mb-3">
            <button className="btn btn-primary btn-block">
              Send Reset Link
            </button>
          </div>
        </form>

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

        <div className="text-center mt-3">
          Remember ? <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
