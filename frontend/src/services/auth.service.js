import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api") + "/auth/";

const register = (
  username,
  password,
  firstName,
  lastName,
  email,
  phoneNumber,
  department,
  role,
) => {
  return axios.post(API_URL + "register", {
    username,
    password,
    firstName,
    lastName,
    email,
    phoneNumber,
    department,
    role,
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "login", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    const user = JSON.parse(userStr);

    try {
      const decodedToken = jwtDecode(user.token);
      if (decodedToken.exp * 1000 < Date.now()) {
        logout();
        return null;
      }
    } catch (e) {
      return null;
    }

    return user;
  }
  return null;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};
