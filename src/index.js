import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Detectar si estamos dentro de Electron
const isElectron = navigator.userAgent.toLowerCase().includes("electron");

// Configuración global de Axios
axios.defaults.baseURL = "http://127.0.0.1:8000/api";
axios.defaults.headers.common["Accept"] = "application/json";

// Interceptor para manejar autenticación
axios.interceptors.request.use((config) => {
  const authData = JSON.parse(localStorage.getItem("auth"));
  if (authData?.token) {
    config.headers.Authorization = `Bearer ${authData.token}`;
  }
  return config;
});

// Interceptor para manejar errores
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth");
      if (!isElectron) {
        window.location.href = "/login";
      } else {
        console.log("Redirección bloqueada en Electron");
      }
    }
    return Promise.reject(error);
  }
);

// Renderizar la app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
