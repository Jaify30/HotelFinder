import { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import CardEstadistica from "../components/CardEstadistica";
import { faClipboardList, faHotel, faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { appsettings } from "../settings/appsettings";
import { useNavigate } from "react-router-dom";
import type { Hotel } from "../types/Hoteles";

export default function AdminPanel() {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [seccion, setSeccion] = useState("hoteles"); // 👈 estado para controlar qué mostrar
  const navigate = useNavigate();

  useEffect(() => {
  const rol = localStorage.getItem("rol");
  if (rol !== "admin") navigate("/");
  }, [navigate]);

  useEffect(() => {
    fetch(`${appsettings.apiUrl}Hotele/Lista`)
      .then((res) => res.json())
      .then((data) => setHoteles(data))
      .catch((err) => console.error(err));
  }, []);

  const calcularPromedioEstrellas = () => {
    if (hoteles.length === 0) return 0;
    const totalEstrellas = hoteles.reduce((acc, hotel) => acc + (hotel.estrellas || 0), 0);
    return (totalEstrellas / hoteles.length).toFixed(1);
  };

  const handleAgregarHabitaciones = (id: number) => {
    navigate(`/AgregarHabitaciones/${id}`);
  };

  return (
    
    <div className="flex">
      <Sidebar setSeccion={setSeccion} />

      <div className="flex-1 bg-gray-100 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Panel de Administración — {seccion.charAt(0).toUpperCase() + seccion.slice(1)}
        </h1>

        {/* 🔹 Mostramos contenido según la sección */}
        {seccion === "hoteles" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <CardEstadistica titulo="Hoteles" valor={hoteles.length} icono={<FontAwesomeIcon icon={faHotel} />} />
              <CardEstadistica titulo="Usuarios" valor={124} icono={<FontAwesomeIcon icon={faUser} />} />
              <CardEstadistica titulo="Reservas" valor={58} icono={<FontAwesomeIcon icon={faClipboardList} />} />
              <CardEstadistica titulo="Valoración Promedio" valor={`${calcularPromedioEstrellas()}`} icono={<FontAwesomeIcon icon={faStar} />} />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hoteles Registrados</h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th className="py-2">Nombre</th>
                    <th className="py-2">País</th>
                    <th className="py-2">Ciudad</th>
                    <th className="py-2 text-center">Estrellas</th>
                    <th className="py-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {hoteles.map((hotel) => (
                    <tr key={hotel.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{hotel.nombre}</td>
                      <td className="py-3">{hotel.pais}</td>
                      <td className="py-3">{hotel.ciudad}</td>
                      <td className="py-3 text-center">{hotel.estrellas}</td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => handleAgregarHabitaciones(hotel.id)}
                          className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 flex items-center justify-center gap-1 mx-auto"
                        >
                          <FontAwesomeIcon icon={faHotel} /> Agregar habitaciones
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {hoteles.length === 0 && (
                <p className="text-center text-gray-500 mt-4">No hay hoteles registrados.</p>
              )}
            </div>
          </>
        )}

        {seccion === "usuarios" && <p className="text-gray-700">Aquí se mostrarán los usuarios registrados.</p>}
        {seccion === "reservas" && <p className="text-gray-700">Aquí se mostrarán las reservas.</p>}
        {seccion === "valoraciones" && <p className="text-gray-700">Aquí se mostrarán las valoraciones.</p>}
      </div>
    </div>
  );
}
