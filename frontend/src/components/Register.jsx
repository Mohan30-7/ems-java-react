import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    department: "",
    role: "user",
  });
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const onlyNums = value.replace(/\D/g, "");
      if (onlyNums.length <= 10) {
        setFormData({ ...formData, [name]: onlyNums });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    AuthService.register(
      formData.username,
      formData.password,
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.phoneNumber,
      formData.department,
      formData.role,
    ).then(
      (response) => {
        setMessage("Signup successful");
        setSuccessful(true);
        setTimeout(() => navigate("/login"), 2000);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      },
    );
  };

  const isPhoneInvalid =
    formData.phoneNumber &&
    formData.phoneNumber.replace(/\D/g, "").length > 0 &&
    formData.phoneNumber.replace(/\D/g, "").length < 10;

  return (
    <div className="col-md-12 mt-5 mb-5">
      <div
        className="card card-container p-4 mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <h3 className="text-center mb-4">Register</h3>
        <form onSubmit={handleRegister}>
          {!successful && (
            <div>
              <div className="form-group mb-3">
                <label>Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group mb-3">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label>Phone Number</label>
                <input
                  type="tel"
                  className={`form-control ${isPhoneInvalid ? "is-invalid" : ""}`}
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  maxLength="10"
                />
                {isPhoneInvalid && (
                  <div className="form-text text-danger d-flex align-items-center">
                    <span className="me-1 fw-bold">!</span>
                    Phone number must be 10 digits.
                  </div>
                )}
              </div>
              <div className="form-group mb-4">
                <label>Department</label>
                <input
                  type="text"
                  className="form-control"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group d-grid">
                <button className="btn btn-primary btn-block">Sign Up</button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group mt-3">
              <div
                className={
                  successful ? "alert alert-success" : "alert alert-danger"
                }
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
