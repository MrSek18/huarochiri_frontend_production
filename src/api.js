import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // URL base
  timeout: 5000, // Tiempo máximo de espera
});

export default api;
