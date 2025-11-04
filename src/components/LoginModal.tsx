import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { appsettings } from "../settings/appsettings";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (rol: string, usuario: any) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: Props) {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const handleCrearCuenta = () => navigate("/crear");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo || !contraseña) {
      Swal.fire("Campos vacíos", "Completa correo y contraseña", "warning");
      return;
    }

    try {
      const res = await fetch(`${appsettings.apiUrl}Auth/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje || "Error en el inicio de sesión");

      Swal.fire({
        title: "✅ Bienvenido",
        text: data.mensaje,
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        // Guardar sesión local
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("usuario", JSON.stringify(data.datos));

        // 🔹 Avisar al Header sin recargar
        if (onLoginSuccess) {
          onLoginSuccess(data.rol, data.datos);
        }


        // Redirigir según rol
        if (data.rol === "admin") navigate("/");
        else navigate("/");
        onClose();
      });
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // 🔹 Cerrar con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
        isOpen
          ? "opacity-100 visible backdrop-blur-md bg-black/50"
          : "opacity-0 invisible"
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-2xl shadow-2xl w-96 p-8 transform transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <h3 className="text-3xl font-bold text-center mb-6 bg-linear-to-r from-orange-500 to-yellow-400 text-transparent bg-clip-text">
          Iniciar sesión
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm mb-1 font-medium">
              Correo o usuario
            </label>
            <input
              type="text"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              placeholder="ejemplo@gmail.com / admin"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1 font-medium">
              Contraseña
            </label>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
              placeholder="********"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 text-gray-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Entrar
          </button>
        </form>
        <div className="mt-6 space-y-3">
          <button
            onClick={handleCrearCuenta}
            className="w-full bg-linear-to-r from-orange-500 to-yellow-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Crear una cuenta
          </button>

          <button
            onClick={onClose}
            className="w-full border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
      
    </div>
  );
}
