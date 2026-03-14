import { useState, useEffect } from "react";
import api from "../services/api";

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = () => {
    api.get("/attendance").then(
      (response) => {
        setAttendance(response.data);
      },
      (error) => {
        console.error("Error fetching attendance", error);
        setMessage(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            "Error loading attendance",
        );
      },
    );
  };

  const filteredAttendance = attendance.filter((att) =>
    att.user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Employee Attendance Records</h3>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Date</th>
              <th>Check-in Time</th>
              <th>Check-out Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              filteredAttendance.map((att) => (
                <tr key={att.id}>
                  <td>{att.id}</td>
                  <td>{att.user.username}</td>
                  <td>{att.date}</td>
                  <td>{att.checkInTime}</td>
                  <td>{att.checkOutTime || "-"}</td>
                  <td>
                    <span
                      className={`badge ${att.status === "PRESENT" ? "bg-success" : att.status === "ABSENT" ? "bg-danger" : "bg-primary"}`}
                    >
                      {att.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAttendance;
