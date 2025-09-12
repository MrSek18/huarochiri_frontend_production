import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dni: "",
    celular: "",
    password: "",
    password_confirmation: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Cargar reCAPTCHA v3
  useEffect(() => {
    const scriptId = "google-recaptcha-v3";

    if (document.getElementById(scriptId)) {
      if (window.grecaptcha) setRecaptchaReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const checkRecaptcha = () => {
        if (window.grecaptcha?.execute) setRecaptchaReady(true);
        else setTimeout(checkRecaptcha, 100);
      };
      checkRecaptcha();
    };
    script.onerror = () =>
      setGlobalError("Error al cargar reCAPTCHA. Recarga la página.");

    document.body.appendChild(script);

    return () => {
      const scriptElement = document.getElementById(scriptId);
      if (scriptElement) document.body.removeChild(scriptElement);
    };
  }, []);

  // Calcular fortaleza de contraseña
  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[@$!%*#?&]/.test(formData.password)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

  const getRecaptchaToken = async () => {
    if (!window.grecaptcha?.execute)
      throw new Error("reCAPTCHA no está disponible");

    return await window.grecaptcha.execute(
      process.env.REACT_APP_RECAPTCHA_SITE_KEY,
      { action: "register" }
    );
  };

  const validateField = (name, value) => {
    const errors = { ...fieldErrors };
    switch (name) {
      case "name":
        errors.name = value.trim() ? "" : "Nombre es requerido";
        break;
      case "email":
        errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Email inválido";
        break;
      case "dni":
        errors.dni = /^\d{8}$/.test(value) ? "" : "DNI debe tener 8 dígitos";
        break;
      case "celular":
        errors.celular = /^9\d{8}$/.test(value)
          ? ""
          : "Debe comenzar con 9 y tener 9 dígitos";
        break;
      case "password":
        if (value.length < 8) errors.password = "Mínimo 8 caracteres";
        else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])/.test(value))
          errors.password = "Requiere mayúscula, minúscula, número y símbolo";
        else errors.password = "";
        break;
      case "password_confirmation":
        errors.password_confirmation =
          value === formData.password ? "" : "No coincide";
        break;
      default:
        break;
    }
    setFieldErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setSuccess("");

    // Validar campos
    const hasErrors = Object.keys(formData).some((key) => {
      validateField(key, formData[key]);
      return fieldErrors[key];
    });
    if (hasErrors) {
      setGlobalError("Por favor corrige los errores en el formulario");
      return;
    }

    setIsLoading(true);

    try {
      // Obtener token reCAPTCHA
      const token = await getRecaptchaToken();
      console.log("Token reCAPTCHA:", token);

      // Preparar payload
      const payload = { ...formData, "g-recaptcha-response": token };

      // Llamar API
      const response = await axios.post(
        "https://huarochiri-backend-production.onrender.com/api/register",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSuccess("¡Registro exitoso! Redirigiendo...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      // Log de error
      console.error("Error al registrar:", err);

      // Mostrar errores del backend si existen
      if (err.response?.data?.errors) {
        const backendErrors = {};
        Object.entries(err.response.data.errors).forEach(([key, msgs]) => {
          backendErrors[key] = Array.isArray(msgs) ? msgs.join(" ") : msgs;
        });
        setFieldErrors((prev) => ({ ...prev, ...backendErrors }));

        // Error global si es reCAPTCHA
        if (backendErrors["g-recaptcha-response"]) {
          setGlobalError(
            `Error de seguridad: ${backendErrors["g-recaptcha-response"]}`
          );
        }
      } else {
        setGlobalError(err.message || "Error al registrar. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 2) return "bg-red-500";
    if (passwordStrength < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF2DF]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="flex justify-center">
          <img
            src={`${process.env.PUBLIC_URL}/imgs/clients_logo_recortado.png`}
            alt="Logo"
            className="h-28 w-auto"
          />
        </div>

        {globalError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-sm text-red-700">{globalError}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Nombre */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre completo
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                fieldErrors.name ? "border-red-500" : "border-[#0F4C30]"
              } rounded-xl shadow-sm focus:outline-none focus:ring-[#0E4D30] focus:border-[#0E4D30]`}
              value={formData.name}
              onChange={handleChange}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          {/* DNI y Celular */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="dni"
                className="block text-sm font-medium text-gray-700"
              >
                DNI
              </label>
              <input
                type="text"
                name="dni"
                id="dni"
                required
                maxLength={8}
                className={`mt-1 block w-full px-3 py-2 border ${
                  fieldErrors.dni ? "border-red-500" : "border-[#0F4C30]"
                } rounded-xl shadow-sm focus:outline-none focus:ring-[#0E4D30] focus:border-[#0E4D30]`}
                value={formData.dni}
                onChange={handleChange}
              />
              {fieldErrors.dni && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.dni}</p>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="celular"
                className="block text-sm font-medium text-gray-700"
              >
                Celular
              </label>
              <input
                type="tel"
                name="celular"
                id="celular"
                required
                maxLength={9}
                className={`mt-1 block w-full px-3 py-2 border ${
                  fieldErrors.celular ? "border-red-500" : "border-[#0F4C30]"
                } rounded-xl shadow-sm focus:outline-none focus:ring-[#0E4D30] focus:border-[#0E4D30]`}
                value={formData.celular}
                onChange={handleChange}
              />
              {fieldErrors.celular && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.celular}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                fieldErrors.email ? "border-red-500" : "border-[#0F4C30]"
              } rounded-xl shadow-sm focus:outline-none focus:ring-[#0E4D30] focus:border-[#0E4D30]`}
              value={formData.email}
              onChange={handleChange}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                required
                className={`mt-1 block w-full px-3 py-2 border ${
                  fieldErrors.password ? "border-red-500" : "border-[#0F4C30]"
                } rounded-xl shadow-sm focus:outline-none focus:ring-[#0E4D30] focus:border-[#0E4D30]`}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {fieldErrors.password ? (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.password}
              </p>
            ) : (
              <div className="mt-2">
                <div className="flex gap-1 h-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full ${
                        passwordStrength >= i
                          ? getPasswordStrengthColor()
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {passwordStrength < 2
                    ? "Débil"
                    : passwordStrength < 4
                    ? "Moderada"
                    : "Fuerte"}
                </p>
              </div>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label
              htmlFor="password_confirmation"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmar Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password_confirmation"
              id="password_confirmation"
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                fieldErrors.password_confirmation
                  ? "border-red-500"
                  : "border-[#0F4C30]"
              } rounded-xl shadow-sm focus:outline-none focus:ring-[#0E4D30] focus:border-[#0E4D30]`}
              value={formData.password_confirmation}
              onChange={handleChange}
            />
            {fieldErrors.password_confirmation && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.password_confirmation}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !recaptchaReady}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0E4D30] hover:bg-[#0B7745] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0E4D30] tracking-[0.10em] transition-colors ${
                isLoading || !recaptchaReady
                  ? "opacity-75 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
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
                  Registrando...
                </>
              ) : (
                "Crear cuenta"
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-[#0E4D30] hover:text-[#0B7745] tracking-[0.10em] transition-colors"
          >
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
