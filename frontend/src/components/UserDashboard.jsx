import { useState, useEffect } from "react";
import api from "../services/api";

const UserDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    api.get("/profile").then(
      (response) => {
        setProfile(response.data);
      },
      (error) => {
        setMessage(error.message);
      },
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const onlyNums = value.replace(/\D/g, "");
      if (onlyNums.length <= 10) {
        setProfile({ ...profile, [name]: onlyNums });
      }
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const { password, ...payload } = profile;
    api.put(`/employees/${profile.id}`, payload).then(
      (response) => {
        setMessage(response.data.message);
        setEditMode(false);
      },
      (error) => {
        setMessage(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            error.message,
        );
      },
    );
  };

  const isPhoneInvalid =
    profile &&
    profile.phoneNumber &&
    profile.phoneNumber.replace(/\D/g, "").length > 0 &&
    profile.phoneNumber.replace(/\D/g, "").length < 10;

  if (!profile) return <div className="mt-5 text-center">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">My Profile</h3>
              {profile.role === "ROLE_ADMIN" && (
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
              )}
            </div>
            <div className="card-body p-4">
              {message && <div className="alert alert-info">{message}</div>}

              {profile.role !== "ROLE_ADMIN" && (
                <div className="alert alert-warning mb-4">
                  To request a change to your profile information, please
                  navigate to the <strong>Contact Admin</strong> tab.
                </div>
              )}

              <form onSubmit={handleUpdate}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label>Username</label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={profile.username}
                      onChange={handleInputChange}
                      disabled={profile.role !== "ROLE_ADMIN" || !editMode}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Role</label>
                    {profile.role === "ROLE_ADMIN" && editMode ? (
                      <select
                        className="form-control"
                        name="role"
                        value={profile.role}
                        onChange={handleInputChange}
                      >
                        <option value="ROLE_USER">ROLE_USER</option>
                        <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="role"
                        value={profile.role}
                        disabled
                      />
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label>First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      className={`form-control ${isPhoneInvalid ? "is-invalid" : ""}`}
                      name="phoneNumber"
                      value={profile.phoneNumber || ""}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      maxLength="10"
                    />
                    {isPhoneInvalid && (
                      <small className="text-danger d-block">
                        ! Phone number should have 10 digits.
                      </small>
                    )}
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label>Department</label>
                    <input
                      type="text"
                      className="form-control"
                      name="department"
                      value={profile.department}
                      onChange={handleInputChange}
                      disabled={profile.role !== "ROLE_ADMIN" || !editMode}
                      required
                    />
                  </div>
                </div>

                {editMode && (
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button type="submit" className="btn btn-success">
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
