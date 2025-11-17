import {
  faCog,
  faPlus,
  faSignOutAlt,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import LoginModal from "./LoginModal";
import { useNavigate } from "react-router-dom";
import type { UsuarioSesion } from "../types/UsuarioSesion";

export default function Header() {
  const navigate = useNavigate();

  const handleCrearHotel = () => navigate("/CrearHotel");

  const [showLogin, setShowLogin] = useState(false);
  const [rol, setRol] = useState<string | null>(null);

  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);

  const handleLogout = () => {
    setRol(null);
    setUsuario(null);
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const rolGuardado = localStorage.getItem("rol");
    const usuarioGuardado = localStorage.getItem("usuario");

    if (rolGuardado) setRol(rolGuardado);
    if (usuarioGuardado) setUsuario(JSON.parse(usuarioGuardado));
  }, []);

  return (
    <>
      <div className="bg-linear-to-b from-orange-500 to-transparent text-white border-white/10">
        <div className="w-full flex justify-between items-center px-8 py-4">
          
          {/* LOGO */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img
              src="/Logo.png"
              alt="HotelFinder Logo"
              className="h-30 w-40 rounded-full object-contain"
            />
            <span className="text-lg font-semibold tracking-wide text-gray-800">
              HotelFinder
            </span>
          </div>

          {/* NAV */}
          <nav className="flex items-center gap-6 font-medium text-gray-800">
            <button onClick={() => navigate("/")} className="hover:text-orange-500 transition">
              Inicio
            </button>
            <button onClick={() => navigate("/Hoteles")} className="hover:text-orange-500 transition">
              Hoteles
            </button>
            <button onClick={() => navigate("/SobreNosotros")} className="hover:text-orange-500 transition">
              Sobre Nosotros
            </button>

            {/* NO LOGUEADO */}
            {!rol && (
              <button onClick={() => setShowLogin(true)} className="hover:text-orange-500 transition">
                <FontAwesomeIcon icon={faUser} />
              </button>
            )}

            {/* USUARIO NORMAL */}
            {rol === "user" && usuario && (
              <>
                <button
                  onClick={() => navigate("/MisReservas")}
                  className="hover:text-orange-500 transition"
                >
                  Mis Reservas
                </button>

                <span className="font-medium text-gray-800">
                  Hola, {usuario.nombre}
                </span>

                <button
                  onClick={handleLogout}
                  className="hover:text-orange-500 transition"
                  title="Cerrar Sesión"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </>
            )}

            {/* ADMIN */}
            {rol === "admin" && (
              <>
                <button
                  onClick={handleCrearHotel}
                  className="flex items-center gap-1 hover:text-orange-500 transition"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Crear Hotel
                </button>

                <button
                  onClick={() => navigate("/AdminPanel")}
                  className="flex items-center gap-1 hover:text-orange-500 transition"
                >
                  <FontAwesomeIcon icon={faCog} />
                  Panel de Administración
                </button>

                <button
                  onClick={handleLogout}
                  className="hover:text-orange-500 transition"
                  title="Cerrar Sesión"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </>
            )}

            {/* CUENTA HOTEL */}
            {rol === "hotel" && usuario && (
              <>
                <button
                  onClick={() => {
                    if (!usuario.idHotel) {
                      console.error("El usuario hotel no tiene idHotel asignado");
                      return;
                    }
                    navigate(`/HotelDashboard/${usuario.idHotel}`);
                  }}
                  className="hover:text-orange-500 transition"
                >
                  Mi Hotel
                </button>

                <button
                  onClick={handleLogout}
                  className="hover:text-orange-500 transition"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </>
            )}
          </nav>
        </div>

        {/* MODAL LOGIN */}
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(rolNuevo, userNuevo) => {
            setRol(rolNuevo);
            setUsuario(userNuevo);
          }}
        />
      </div>
    </>
  );
}
