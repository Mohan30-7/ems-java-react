# Employee Management System (EMS)

A complete beginner-level full-stack web application built with Spring Boot 3.x, React.js (Vite), and MySQL.

## Project Structure

- `backend`: Spring Boot 3.x backend application
- `frontend`: React.js (Vite) frontend application

## Prerequisites
- Java 17+
- Node.js (v18+)
- MySQL Server (must be running on localhost:3306 with user `root` and password `password`)

## Running the Application

### 1. Database Setup
Create a MySQL database named `ems` (the `application.properties` does `createDatabaseIfNotExist=true` so the root connection is usually enough). Ensure your root password is `password` or modify `backend/src/main/resources/application.properties`.

### 2. Start the Backend
Open a terminal in the `backend` directory and run:
```bash
cd backend
mvn spring-boot:run
```
The backend API will run on `http://localhost:8080`. The database tables will be created automatically.

### 3. Start the Frontend
Open a terminal in the `frontend` directory and run:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be accessible at `http://localhost:5173`.

## Roles & Users
- `ROLE_USER`
- `ROLE_ADMIN`

When registering via the UI, there is a dropdown to select User or Admin for testing purposes.

---

## Postman API Tests

### 1. Register a User (or Admin)
- **URL**: `POST http://localhost:8080/api/auth/register`
- **Body** (JSON):
```json
{
  "username": "adminUser",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "admin@example.com",
  "department": "IT",
  "role": "admin"
}
```

### 2. Login
- **URL**: `POST http://localhost:8080/api/auth/login`
- **Body** (JSON):
```json
{
  "username": "adminUser",
  "password": "password123"
}
```
*Note: Copy the `token` from the response. For subsequent requests, add a Header: `Authorization: Bearer <your_token>`*

### 3. Get All Employees (Admin Only)
- **URL**: `GET http://localhost:8080/api/employees`
- **Headers**: `Authorization: Bearer <token>`

### 4. Create Employee (Admin Only)
- **URL**: `POST http://localhost:8080/api/employees`
- **Headers**: `Authorization: Bearer <token>`
- **Body** (JSON):
```json
{
  "username": "newUser",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "department": "HR"
}
```

### 5. Get Own Profile
- **URL**: `GET http://localhost:8080/api/profile`
- **Headers**: `Authorization: Bearer <token>`

### 6. Update Profile (Admin or Owner)
- **URL**: `PUT http://localhost:8080/api/employees/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Body** (JSON):
```json
{
  "firstName": "Jane updated",
  "department": "Sales"
}
```

### 7. Delete Employee (Admin Only)
- **URL**: `DELETE http://localhost:8080/api/employees/{id}`
- **Headers**: `Authorization: Bearer <token>`
