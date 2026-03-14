import { useState, useEffect } from "react";
import api from "../services/api";
import { Modal, Button, Form } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    department: "",
    role: "user",
  });

  useEffect(() => {
    fetchEmployees();
    fetchStats();
  }, []);

  const fetchStats = () => {
    api.get("/analytics/dashboard").then(
      (response) => {
        setStats(response.data);
      },
      (error) => {
        console.error("Error fetching stats", error);
      },
    );
  };

  const fetchEmployees = () => {
    api.get("/employees").then(
      (response) => {
        setEmployees(response.data);
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

  const deleteEmployee = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      api.delete(`/employees/${id}`).then(
        (response) => {
          setMessage(response.data.message);
          fetchEmployees();
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
    }
  };

  const handleEditClick = (employee) => {
    setMessage("");
    setCurrentEmployee({
      ...employee,
      roleInput: employee.role === "ROLE_ADMIN" ? "admin" : "user",
    });
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setCurrentEmployee(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const onlyNums = value.replace(/\D/g, "");
      if (onlyNums.length <= 10) {
        setCurrentEmployee({ ...currentEmployee, [name]: onlyNums });
      }
    } else {
      setCurrentEmployee({ ...currentEmployee, [name]: value });
    }
  };

  const handleAddModalClose = (clearMessage = true) => {
    if (clearMessage) {
      setMessage("");
    }
    setShowAddModal(false);
    setNewEmployee({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      department: "",
      role: "user",
    });
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const onlyNums = value.replace(/\D/g, "");
      if (onlyNums.length <= 10) {
        setNewEmployee({ ...newEmployee, [name]: onlyNums });
      }
    } else {
      setNewEmployee({ ...newEmployee, [name]: value });
    }
  };

  const submitEdit = (e) => {
    e.preventDefault();
    const digits =
      currentEmployee.phoneNumber &&
      currentEmployee.phoneNumber.replace(/\D/g, "");
    if (digits && digits.length > 0 && digits.length < 10) {
      setMessage("Phone number must be at least 10 digits.");
      return;
    }
    const payload = {
      firstName: currentEmployee.firstName,
      lastName: currentEmployee.lastName,
      email: currentEmployee.email,
      phoneNumber: currentEmployee.phoneNumber || "",
      department: currentEmployee.department,
      role: currentEmployee.roleInput,
    };

    api.put(`/employees/${currentEmployee.id}`, payload).then(
      (response) => {
        setMessage("Employee updated successfully");
        setShowEditModal(false);
        fetchEmployees();
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

  const submitAdd = (e) => {
    e.preventDefault();
    const digits =
      newEmployee.phoneNumber && newEmployee.phoneNumber.replace(/\D/g, "");
    if (digits && digits.length > 0 && digits.length < 10) {
      setMessage("Phone number must be at least 10 digits.");
      return;
    }
    api.post("/employees", newEmployee).then(
      (response) => {
        setMessage("New user created successfully");
        handleAddModalClose(false);
        fetchEmployees();
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

  const filteredEmployees = employees.filter((emp) =>
    emp.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleExportCSV = () => {
    if (!employees || employees.length === 0) return;

    const headers = [
      "ID",
      "Username",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Department",
      "Role",
    ];
    const csvRows = [];
    csvRows.push(headers.join(","));

    employees.forEach((emp) => {
      const row = [
        emp.id,
        `"${emp.username}"`,
        `"${emp.firstName}"`,
        `"${emp.lastName}"`,
        `"${emp.email}"`,
        `"${emp.phoneNumber || ""}"`,
        `"${emp.department}"`,
        `"${emp.role}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "employees.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getChartData = () => {
    if (!stats || !stats.departmentCounts) return [];
    return Object.keys(stats.departmentCounts).map((dept) => ({
      name: dept,
      value: stats.departmentCounts[dept],
    }));
  };
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
  ];

  return (
    <div className="container mt-5">
      {stats && (
        <div className="row mb-5">
          <div className="col-md-4">
            <div className="card text-white bg-primary mb-3 text-center">
              <div className="card-header">Total Employees</div>
              <div className="card-body">
                <h3 className="card-title">{stats.totalEmployees}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-warning mb-3 text-center">
              <div className="card-header">Pending Leave Requests</div>
              <div className="card-body">
                <h3 className="card-title">{stats.pendingLeaveRequests}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-danger mb-3 text-center">
              <div className="card-header">Pending Complaints</div>
              <div className="card-body">
                <h3 className="card-title">{stats.pendingHelpRequests}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {stats &&
        stats.departmentCounts &&
        Object.keys(stats.departmentCounts).length > 0 && (
          <div className="row mb-5">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">Employees by Department</div>
                <div className="card-body d-flex justify-content-center">
                  <PieChart width={400} height={300}>
                    <Pie
                      data={getChartData()}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {getChartData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </div>
              </div>
            </div>
          </div>
        )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Admin Dashboard - Employee List</h3>
        <div>
          <button className="btn btn-secondary me-2" onClick={handleExportCSV}>
            Export CSV
          </button>
          <button
            className="btn btn-success"
            onClick={() => setShowAddModal(true)}
          >
            + Add User
          </button>
        </div>
      </div>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No employees found matching '{searchTerm}'.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.username}</td>
                  <td>{`${emp.firstName} ${emp.lastName}`}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phoneNumber}</td>
                  <td>{emp.department}</td>
                  <td>{emp.role}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditClick(emp)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteEmployee(emp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentEmployee && (
            <Form onSubmit={submitEdit} id="editForm">
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={currentEmployee.firstName}
                  onChange={handleEditInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={currentEmployee.lastName}
                  onChange={handleEditInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={currentEmployee.email}
                  onChange={handleEditInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={currentEmployee.phoneNumber || ""}
                  onChange={handleEditInputChange}
                  isInvalid={
                    currentEmployee.phoneNumber &&
                    currentEmployee.phoneNumber.replace(/\D/g, "").length > 0 &&
                    currentEmployee.phoneNumber.replace(/\D/g, "").length < 10
                  }
                  maxLength="10"
                />
                <Form.Control.Feedback type="invalid">
                  Phone number must be at least 10 digits.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  name="department"
                  value={currentEmployee.department}
                  onChange={handleEditInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="roleInput"
                  value={currentEmployee.roleInput}
                  onChange={handleEditInputChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" form="editForm">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitAdd} id="addForm">
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={newEmployee.username}
                onChange={handleAddInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={newEmployee.password}
                onChange={handleAddInputChange}
                required
                minLength="6"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={newEmployee.firstName}
                onChange={handleAddInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={newEmployee.lastName}
                onChange={handleAddInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newEmployee.email}
                onChange={handleAddInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phoneNumber"
                value={newEmployee.phoneNumber}
                onChange={handleAddInputChange}
                isInvalid={
                  newEmployee.phoneNumber &&
                  newEmployee.phoneNumber.replace(/\D/g, "").length > 0 &&
                  newEmployee.phoneNumber.replace(/\D/g, "").length < 10
                }
                maxLength="10"
              />
              <Form.Control.Feedback type="invalid">
                Phone number must be at least 10 digits.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={newEmployee.department}
                onChange={handleAddInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={newEmployee.role}
                onChange={handleAddInputChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddModalClose}>
            Close
          </Button>
          <Button variant="success" type="submit" form="addForm">
            Create User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
