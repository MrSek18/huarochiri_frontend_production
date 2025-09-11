import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // <-- usa tu instancia de Axios con baseURL

export default function Configuracion({ user, onLogout }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    dni: user?.dni || "",
    celular: user?.celular || "",
  });

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dniRef = useRef(null);
  const celularRef = useRef(null);

  const adjustInputWidth = (ref, value) => {
    if (ref.current) {
      const tempSpan = document.createElement("span");
      tempSpan.style.visibility = "hidden";
      tempSpan.style.position = "absolute";
      tempSpan.style.whiteSpace = "pre";
      tempSpan.style.font = window.getComputedStyle(ref.current).font;
      tempSpan.style.padding = "0 12px";
      tempSpan.textContent = value || "";

      document.body.appendChild(tempSpan);
      const newWidth = Math.min(
        tempSpan.scrollWidth + 24,
        ref.current.parentElement.offsetWidth - 100
      );
      ref.current.style.width = `${newWidth}px`;
      document.body.removeChild(tempSpan);
    }
  };

  const handleSave = async (field) => {
    try {
      // Obtener token desde localStorage
      const authData = JSON.parse(localStorage.getItem("auth"));
      const token = authData?.token;

      if (!token) {
        throw new Error("Token no disponible. Por favor inicia sesión de nuevo.");
      }

      // Configurar el token en la instancia de Axios
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await api.put(`/user/${user.id}`, {
        [field]: formData[field],
      });

      console.log("Datos actualizados:", response.data);
    } catch (error) {
      console.error("Error al actualizar:", error);

      // Si el error es 401, hacer logout
      if (error.response?.status === 401) {
        onLogout();
      }
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-[#FBF2DF]"
      style={{ fontFamily: '"Roboto SemiCondensed", sans-serif' }}
    >
      <div className="h-full w-full max-w-md space-y-6 bg-white rounded-xl shadow-lg overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-1">
          <button
            onClick={() => navigate(-1)}
            className="group flex p-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-8 h-8 text-black group-hover:text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        <div className="ml-5 mr-5">
          <h1 className="text-2xl font-medium mb-6">Configuración de cuenta</h1>

          <div className="space-y-6">
            {["name", "email", "password", "dni", "celular"].map((field) => {
              const refMap = {
                name: nameRef,
                email: emailRef,
                password: passwordRef,
                dni: dniRef,
                celular: celularRef,
              };
              const typeMap = {
                name: "text",
                email: "email",
                password: "password",
                dni: "text",
                celular: "tel",
              };
              return (
                <div className="flex flex-col" key={field}>
                  <label className="block text-sm font-medium mb-1">
                    {field === "password"
                      ? "Contraseña"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      ref={refMap[field]}
                      type={typeMap[field]}
                      className="block px-3 py-2 border-2 border-[#0F4C30] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-[#209F65] min-w-[50px]"
                      value={formData[field]}
                      onChange={(e) => {
                        setFormData({ ...formData, [field]: e.target.value });
                        adjustInputWidth(
                          refMap[field],
                          field === "password" ? e.target.value || "••••••••" : e.target.value
                        );
                      }}
                      placeholder={field === "password" ? "••••••••" : ""}
                    />
                    <button
                      onClick={() => handleSave(field)}
                      className="px-3 py-1 bg-[#C9F9C7] rounded-md border-2 border-[#0F4C30] hover:bg-[#B0E8AE] transition-colors text-black font-medium"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
