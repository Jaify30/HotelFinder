import { faCog, faPlus, faSignOut, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react';
import LoginModal from './LoginModal';
import { useNavigate } from 'react-router-dom';

export default function Header() {

  const navigate = useNavigate();
  const handleCrearHotel = () => navigate("/CrearHotel");

  const [showLogin, setShowLogin] = useState(false);
  const [rol, setRol] = useState<string | null>(null);

  const handleLogout = () => {
    setRol(null);
    localStorage.clear();
    navigate("/");
  };

  const [usuario, setUsuario] = useState<{ nombre?: string } | null>(null);

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
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/Logo.png"
              alt="HotelFinder Logo"
              className="h-30 w-40 rounded-full object-contain cursor-pointer"
              onClick={() => navigate("/")}
            />
            <span className="text-lg font-semibold tracking-wide text-gray-800">HotelFinder</span>
          </div>

          {/* Navegación */}
          <nav className="flex items-center gap-6 font-medium text-gray-800">
            <button onClick={() => navigate("/")} className="hover:text-orange-500 transition">Inicio</button>
            <button onClick={() => navigate("/Hoteles")} className="hover:text-orange-500 transition">Hoteles</button>
            <button onClick={() => navigate("/SobreNosotros")} className="hover:text-orange-500 transition">Sobre Nosotros</button>

            {/* No logueado */}
            {rol === null && (
              <button onClick={() => setShowLogin(true)} className="hover:text-orange-500 transition">
                <FontAwesomeIcon icon={faUser} className="ml-2" />
              </button>
            )}

            {rol === "user" && (
              <>
                <button
                    onClick={() => navigate("/MisReservas")}
                    className="hover:text-orange-500 transition"
                  >
                    Mis Reservas
                </button>
                <span className="font-medium text-gray-800">Hola, {usuario?.nombre}</span>

                

                <button
                  onClick={handleLogout}
                  className="hover:text-orange-500 transition"
                  title="Cerrar Sesión"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </>
            )}

            {/* Admin */}
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
                  <FontAwesomeIcon icon={faSignOut} />
                </button>
              </>
            )}
          </nav>
        </div>

        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onLoginSuccess={(rol, usuario)=>{
          setRol(rol);
          setUsuario(usuario);
        }} />
      </div>

      {/* Botones para probar login */}
      
    </>
  );
}
