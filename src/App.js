import React, { useState, useEffect, useCallback } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import RegisterForm from "./components/RegisterForm";
import Configuracion from "./components/Configuracion";

// Configuración global de Axios
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common["Accept"] = "application/json";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("auth");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    window.dispatchEvent(new Event("storage"));
  }, []);

  const handleLogin = useCallback((userData, token) => {
    const authData = { user: userData, token };
    localStorage.setItem("auth", JSON.stringify(authData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  }, []);

  useEffect(() => {
    const verifyAuth = async () => {
      const authData = JSON.parse(localStorage.getItem("auth"));

      if (!authData?.token) {
        setLoading(false);
        return;
      }

      try {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${authData.token}`;
        const response = await axios.get("/user");
        setUser(response.data.user || authData.user);
      } catch (error) {
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [handleLogout]);

  const PrivateRoute = ({ children }) => {
    if (loading) {
      return <div>Cargando...</div>;
    }
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginForm onLogin={handleLogin} />
            )
          }
        />

        <Route path="/register" element={<RegisterForm />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard user={user} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        <Route
          path="/configuracion"
          element={
            <PrivateRoute>
              <Configuracion user={user} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
