import { useState, useEffect } from "react";
import api from "../services/api";

const ContactAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    api.get("/messages/my").then(
      (response) => {
        setMessages(response.data);
      },
      (error) => {
        setAlertMessage("Error fetching messages.");
      },
    );
  };

  const submitMessage = (e) => {
    e.preventDefault();
    api.post("/messages/my", { content }).then(
      (response) => {
        setContent("");
        setAlertMessage("Message sent successfully!");
        fetchMessages();
      },
      (error) => {
        setAlertMessage("Error sending message.");
      },
    );
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Contact Admin</h3>
      {alertMessage && <div className="alert alert-info">{alertMessage}</div>}

      <div className="card mb-5">
        <div className="card-header bg-primary text-white">
          Submit a Request (e.g. Change department, name)
        </div>
        <div className="card-body">
          <form onSubmit={submitMessage}>
            <div className="form-group mb-3">
              <label>Your Message / Issue</label>
              <textarea
                className="form-control mt-2"
                rows="4"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Describe what you need updated on your profile..."
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <h4 className="mb-3">My Request History</h4>
      {messages.length === 0 ? (
        <p>You have not submitted any requests yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Message</th>
                <th>Status</th>
                <th>Admin Reply</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.id}</td>
                  <td>{msg.content}</td>
                  <td>
                    <span
                      className={`badge ${msg.status === "PENDING" ? "bg-warning" : "bg-success"}`}
                    >
                      {msg.status}
                    </span>
                  </td>
                  <td>
                    {msg.adminReply ? (
                      <div>
                        <p className="mb-1">{msg.adminReply}</p>
                        <small className="text-muted">
                          Messaged by admin {msg.repliedByAdmin}
                        </small>
                      </div>
                    ) : (
                      <em className="text-muted">No reply yet</em>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContactAdmin;
