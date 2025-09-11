import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (authData?.token) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${authData.token}`;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // https://huarochiri-backend-production.onrender.com/ para abajo
    try {
      const response = await axios.post(
        "https://huarochiri-backend-production.onrender.com/api/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Verificación más robusta de la respuesta
      if (!response.data) {
        throw new Error("El servidor no devolvió datos");
      }

      // Manejo flexible de diferentes estructuras de respuesta
      const token = response.data.token || response.data.access_token;
      const user = response.data.user || response.data.data;

      if (!token) {
        throw new Error("No se recibió token de autenticación");
      }

      // Guardar datos de autenticación
      const authData = {
        user: user || { email }, // Si no viene user, crea uno mínimo
        token: token,
      };

      localStorage.setItem("auth", JSON.stringify(authData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      onLogin(authData.user, token);
      navigate("/dashboard");
    } catch (err) {
      // Manejo mejorado de errores
      let errorMessage = "Error en el inicio de sesión";

      if (err.response) {
        // Error del servidor (4xx, 5xx)
        errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          err.response.statusText ||
          `Error ${err.response.status}`;
      } else if (err.request) {
        // La petición fue hecha pero no hubo respuesta
        errorMessage = "El servidor no respondió";
      } else {
        // Error al configurar la petición
        errorMessage = err.message;
      }

      setError(errorMessage);

      // Limpieza de credenciales inválidas
      localStorage.removeItem("auth");
      delete axios.defaults.headers.common["Authorization"];

      console.error("Error en login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF2DF]">
      <div className="w-full max-w-md p-8 space-y-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-center ">
          <img
            src={`${process.env.PUBLIC_URL}/imgs/clients_logo_recortado.png`}
            alt="Logo"
            className="h-60 w-auto"
          />

        </div>

        {/* Mensaje de error persistente */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {" "}
          {/* noValidate desactiva validación HTML */}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium ">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-[#0F4C30] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium ">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-[#0F4C30] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0E4D30] hover:bg-[#0B7745] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0E4D30] tracking-[0.10em] ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Validando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-[#0E4D30] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0E4D30] tracking-[0.10em]"
            >
              Registrar
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600 mt-5">
          <a
            href="#"
            className="font-medium text-[#0E4D30] hover:text-[#0B7745] tracking-[0.10em]"
          >
            Olvidé mi contraseña
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
