import { useState, useEffect } from "react";
import api from "../services/api";
import { Modal, Button, Form } from "react-bootstrap";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    api.get("/messages").then(
      (response) => {
        setMessages(response.data);
      },
      (error) => {
        setAlertMessage("Error fetching messages.");
      },
    );
  };

  const openReplyModal = (msg) => {
    setCurrentMessage(msg);
    setReplyText(msg.adminReply || "");
    setShowReplyModal(true);
  };

  const closeReplyModal = () => {
    setShowReplyModal(false);
    setCurrentMessage(null);
    setReplyText("");
  };

  const submitReply = (e) => {
    e.preventDefault();
    api.put(`/messages/${currentMessage.id}`, { adminReply: replyText }).then(
      (response) => {
        setAlertMessage("Reply sent and marked as resolved.");
        closeReplyModal();
        fetchMessages();
      },
      (error) => {
        setAlertMessage("Error sending reply.");
      },
    );
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">User Complaints & Requests</h3>
      {alertMessage && <div className="alert alert-info">{alertMessage}</div>}

      {messages.length === 0 ? (
        <p>No user complaints or requests.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Message</th>
                <th>Status</th>
                <th>Admin Reply</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.id}</td>
                  <td>
                    {msg.user.username} (ID: {msg.user.id})
                  </td>
                  <td>{msg.content}</td>
                  <td>
                    <span
                      className={`badge ${msg.status === "PENDING" ? "bg-warning text-dark" : "bg-success"}`}
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
                    ) : null}
                  </td>
                  <td>
                    {msg.status !== "RESOLVED" && !msg.adminReply && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => openReplyModal(msg)}
                      >
                        Reply / Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={showReplyModal} onHide={closeReplyModal}>
        <Modal.Header closeButton>
          <Modal.Title>Reply to User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentMessage && (
            <Form onSubmit={submitReply} id="replyForm">
              <div className="mb-3">
                <strong>User: </strong> {currentMessage.user.username}
              </div>
              <div className="mb-3 p-3 bg-light border rounded">
                <strong>Message: </strong> {currentMessage.content}
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Admin Reply</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  required
                  placeholder="Type your reply here..."
                />
                <Form.Text className="text-muted">
                  Submitting a reply will automatically mark this request as
                  RESOLVED.
                </Form.Text>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeReplyModal}>
            Cancel
          </Button>
          <Button variant="success" type="submit" form="replyForm">
            Send Reply & Resolve
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminMessages;
