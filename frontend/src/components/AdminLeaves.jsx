import { useState, useEffect } from "react";
import api from "../services/api";

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");
  const [replyData, setReplyData] = useState({
    id: null,
    status: "APPROVED",
    adminReply: "",
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = () => {
    api.get("/leave").then(
      (response) => {
        setLeaves(response.data);
      },
      (error) => {
        console.error("Error fetching leaves", error);
      },
    );
  };

  const handleActionChange = (e) => {
    setReplyData({ ...replyData, [e.target.name]: e.target.value });
  };

  const submitReply = (e, id) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      status: replyData.status,
      adminReply: replyData.adminReply,
    };

    api.put(`/leave/${id}`, payload).then(
      (response) => {
        setMessage(response.data.message);
        setReplyData({ id: null, status: "APPROVED", adminReply: "" });
        fetchLeaves();
      },
      (error) => {
        setMessage(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            "Error updating leave request",
        );
      },
    );
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Employee Leave Requests</h3>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Dates</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.id}</td>
                  <td>{leave.user.username}</td>
                  <td>
                    {leave.startDate} to {leave.endDate}
                  </td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <span
                      className={`badge ${leave.status === "PENDING" ? "bg-warning" : leave.status === "APPROVED" ? "bg-success" : "bg-danger"}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td>
                    {leave.status === "PENDING" ? (
                      replyData.id === leave.id ? (
                        <form onSubmit={(e) => submitReply(e, leave.id)}>
                          <select
                            className="form-select form-select-sm mb-2"
                            name="status"
                            value={replyData.status}
                            onChange={handleActionChange}
                          >
                            <option value="APPROVED">Approve</option>
                            <option value="REJECTED">Reject</option>
                          </select>
                          <input
                            type="text"
                            className="form-control form-control-sm mb-2"
                            name="adminReply"
                            placeholder="Optional reply"
                            value={replyData.adminReply}
                            onChange={handleActionChange}
                          />
                          <button
                            type="submit"
                            className="btn btn-sm btn-primary me-2"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() =>
                              setReplyData({
                                id: null,
                                status: "APPROVED",
                                adminReply: "",
                              })
                            }
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() =>
                            setReplyData({
                              id: leave.id,
                              status: "APPROVED",
                              adminReply: "",
                            })
                          }
                        >
                          Respond
                        </button>
                      )
                    ) : (
                      <div>
                        <small className="d-block text-muted">
                          {leave.status}
                        </small>
                        {leave.adminReply && (
                          <small className="text-muted d-block mt-1">
                            Note by {leave.repliedByAdmin || "Admin"}:{" "}
                            {leave.adminReply}
                          </small>
                        )}
                      </div>
                    )}
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

export default AdminLeaves;
