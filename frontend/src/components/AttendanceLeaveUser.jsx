import { useState, useEffect } from "react";
import api from "../services/api";

const AttendanceLeaveUser = () => {
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");
  const [leaveData, setLeaveData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "CASUAL",
    reason: "",
  });

  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  useEffect(() => {
    fetchAttendance();
    fetchLeaves();
  }, []);

  const fetchAttendance = () => {
    api.get("/attendance/my").then(
      (response) => {
        const records = response.data;
        setAttendance(records);

        const today = new Date().toISOString().split("T")[0];
        const todayRecord = records.find((r) => r.date === today);
        if (todayRecord) {
          setCheckedIn(true);
          if (todayRecord.checkOutTime) {
            setCheckedOut(true);
          }
        }
      },
      (error) => {
        console.error("Error fetching attendance", error);
      },
    );
  };

  const fetchLeaves = () => {
    api.get("/leave/my").then(
      (response) => {
        setLeaves(response.data);
      },
      (error) => {
        console.error("Error fetching leaves", error);
      },
    );
  };

  const handleCheckIn = () => {
    setMessage("");
    api.post("/attendance/check-in").then(
      (response) => {
        setMessage(response.data.message);
        fetchAttendance();
      },
      (error) => {
        setMessage(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            "Error checking in",
        );
      },
    );
  };

  const handleCheckOut = () => {
    setMessage("");
    api.post("/attendance/check-out").then(
      (response) => {
        setMessage(response.data.message);
        fetchAttendance();
      },
      (error) => {
        setMessage(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            "Error checking out",
        );
      },
    );
  };

  const handleLeaveInputChange = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
  };

  const submitLeave = (e) => {
    e.preventDefault();
    setMessage("");
    api.post("/leave/my", leaveData).then(
      (response) => {
        setMessage(response.data.message);
        setLeaveData({
          startDate: "",
          endDate: "",
          leaveType: "CASUAL",
          reason: "",
        });
        fetchLeaves();
      },
      (error) => {
        setMessage(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            "Error submitting leave",
        );
      },
    );
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Attendance & Leave</h3>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="row mb-5">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              Daily Attendance
            </div>
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <h5 className="mb-4">Mark your attendance for today</h5>
              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn btn-success btn-lg"
                  onClick={handleCheckIn}
                  disabled={checkedIn}
                >
                  Check In
                </button>
                <button
                  className="btn btn-danger btn-lg"
                  onClick={handleCheckOut}
                  disabled={!checkedIn || checkedOut}
                >
                  Check Out
                </button>
              </div>
              {checkedIn && !checkedOut && (
                <p className="mt-3 text-success">
                  You are currently checked in.
                </p>
              )}
              {checkedOut && (
                <p className="mt-3 text-secondary">
                  You have checked out for the day.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              Request Leave
            </div>
            <div className="card-body">
              <form onSubmit={submitLeave}>
                <div className="row mb-2">
                  <div className="col">
                    <label>Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="startDate"
                      value={leaveData.startDate}
                      onChange={handleLeaveInputChange}
                      required
                    />
                  </div>
                  <div className="col">
                    <label>End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="endDate"
                      value={leaveData.endDate}
                      onChange={handleLeaveInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group mb-2">
                  <label>Leave Type</label>
                  <select
                    className="form-select"
                    name="leaveType"
                    value={leaveData.leaveType}
                    onChange={handleLeaveInputChange}
                  >
                    <option value="SICK">Sick Leave</option>
                    <option value="VACATION">Vacation</option>
                    <option value="CASUAL">Casual Leave</option>
                  </select>
                </div>
                <div className="form-group mb-3">
                  <label>Reason</label>
                  <textarea
                    className="form-control"
                    name="reason"
                    rows="2"
                    value={leaveData.reason}
                    onChange={handleLeaveInputChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mb-3">My Leave Requests</h4>
      <div className="table-responsive mb-5">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Start</th>
              <th>End</th>
              <th>Type</th>
              <th>Status</th>
              <th>Admin Reply</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.id}</td>
                  <td>{leave.startDate}</td>
                  <td>{leave.endDate}</td>
                  <td>{leave.leaveType}</td>
                  <td>
                    <span
                      className={`badge ${leave.status === "PENDING" ? "bg-warning" : leave.status === "APPROVED" ? "bg-success" : "bg-danger"}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td>
                    {leave.adminReply ? (
                      <>
                        <strong>{leave.repliedByAdmin || "Admin"}:</strong>{" "}
                        {leave.adminReply}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h4 className="mb-3">Attendance History</h4>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              attendance.map((att) => (
                <tr key={att.id}>
                  <td>{att.date}</td>
                  <td>{att.checkInTime}</td>
                  <td>{att.checkOutTime || "-"}</td>
                  <td>{att.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceLeaveUser;
