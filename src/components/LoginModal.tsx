import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: Props) {
  const navigate = useNavigate();

  const handleCrearCuenta = () => navigate("/crear");

  // 🔹 Permitir cerrar con la tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // lógica de login...
    console.log("Iniciando sesión...");
  };

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
              Correo electrónico
            </label>
            <input
              type="email"
              required
              autoFocus
              placeholder="ejemplo@gmail.com"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1 font-medium">
              Contraseña
            </label>
            <input
              type="password"
              required
              placeholder="********"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
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
