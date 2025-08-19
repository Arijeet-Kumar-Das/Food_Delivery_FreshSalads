import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend URL
});

// Add JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const partnerToken = localStorage.getItem("partnerToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (partnerToken) {
    config.headers.Authorization = `Bearer ${partnerToken}`;
  }
  return config;
});

export default API;
