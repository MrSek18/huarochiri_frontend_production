import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import api from "../api";
const Dashboard = ({ user, onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ref para evitar dependencias cambiantes en onLogout
  const onLogoutRef = useRef(onLogout);
  onLogoutRef.current = onLogout;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("auth"));
        const token = authData?.token;

        if (!token) {
          throw new Error("No hay token disponible");
        }


        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await api.get("/user");


        console.log("Respuesta completa de la API:", response.data);

        if (!response.data?.user) {
          throw new Error("Estructura de respuesta inesperada");
        }

        setUserData({
          id: response.data.user.id,
          name: response.data.user.name || "Usuario",
          email: response.data.user.email || "No especificado",
          role: response.data.user.role || "Usuario estándar",
          monto_aportado:
            "monto_aportado" in response.data.user
              ? response.data.user.monto_aportado
              : 0.0,
          joinedDate: response.data.user.created_at || new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError(error.message);

        // Evitar loop si siempre hay 401
        if (error.response?.status === 401 && user) {
          onLogoutRef.current();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]); // solo cambia si el user en props cambia

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={() => onLogoutRef.current()}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen flex items-center justify-center bg-[#FBF2DF] "
      style={{ fontFamily: '"Roboto SemiCondensed", sans-serif' }}
    >
      <div className="h-full w-full max-w-md space-y-6 bg-white rounded-xl shadow-lg">
        <div className="mt-10 ml-5 mr-5">
          <div className="w-full flex justify-between">
            <h1 className="text-2xl font-medium w-[50%] ">{userData.name}</h1>
            <div className="mt-2">
              <h1 className="text-sm font-light">Monto total aportado</h1>
              <p className="text-lg font-medium mt-2 ">
                S/{userData.monto_aportado}
              </p>
            </div>
          </div>

          <div className="text-xs w-full flex items-center justify-around mt-10 font-medium">
            <Link to="/pagar-servicios">Pagar servicios</Link>
            <Link to="/cuotas">Ver cuotas</Link>
            <Link to="/configuracion">Configuracion</Link>
            <button
              className="text-[#F86060]"
              onClick={() => onLogoutRef.current()}
            >
              Cerrar sesión
            </button>
          </div>

          <div className="w-full flex items-center justify-between mt-10">
            <label className="text-2xl font-medium ">
              Movimientos recientes
            </label>
            <a href="#vertodo" className="font-medium text-[#659666]">
              Ver todo
            </a>
          </div>

          {/* Ejemplos de movimientos, podrías mapearlos desde API */}
          <div className="w-full flex justify-between mt-4 border-b-[0.1em] border-black ">
            <div className="mb-5 ">
              <h1 className="mb-5 font-normal">Servicios de energia rural</h1>
              <label className="mt-3 font-light">23 julio 2024</label>
            </div>
            <div className="flex items-start">
              <label className="font-medium mt-1 text-[#085C00]">$45.40</label>
              <button
                className="group flex p-1 ml-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Omitir"
              >
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                </svg>
              </button>
            </div>
          </div>

          <div className="w-full flex justify-between mt-4 border-b-[0.1em] border-black ">
            <div className="mb-5 ">
              <h1 className="mb-5 font-normal">Servicios de energia rural</h1>
              <label className="mt-3 font-light ">23 julio 2024</label>
            </div>
            <div className="flex items-start">
              <label className="font-medium mt-1 text-[#085C00]">$45.40</label>
              <button
                className="group flex p-1 ml-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Omitir"
              >
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                </svg>
              </button>
            </div>
          </div>

          <div className="w-full flex justify-between mt-4 border-b-[0.1em] border-black ">
            <div className="mb-5 ">
              <h1 className="mb-5 font-normal">Servicios de energia rural</h1>
              <label className="mt-3 font-light ">23 julio 2024</label>
            </div>
            <div className="flex items-start">
              <label className="font-medium mt-1 text-[#085C00]">$45.40</label>
              <button
                className="group flex p-1 ml-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Omitir"
              >
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
