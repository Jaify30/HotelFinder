import { useEffect, useState } from "react";
import CardEstadistica from "../components/CardEstadistica";
import { faClipboardList, faHotel, faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { appsettings } from "../settings/appsettings";
import Sidebar from "./SideBar";
import { useNavigate } from "react-router-dom";

interface Hotel {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Direccion: string;
  Pais: string;
  Ciudad: string;
  Telefono: string;
  Estrellas: number;
  ImagenUrl?: string;
}

export default function AdminPanel() {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${appsettings.apiUrl}Hotele/Lista`)
      .then((res) => res.json())
      .then((data) => setHoteles(data))
      .catch((err) => console.error(err));
  }, []);

  const calcularPromedioEstrellas = () => {
    if (hoteles.length === 0) return 0;
    const totalEstrellas = hoteles.reduce((acc, hotel) => acc + (hotel.Estrellas || 0), 0);
    return (totalEstrellas / hoteles.length).toFixed(1);
  };

  const handleAgregarHabitaciones = (id: number) => {
    navigate(`/AgregarHabitaciones/${id}`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Administración</h1>

        {/* Tarjetas estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <CardEstadistica titulo="Hoteles" valor={hoteles.length} icono={<FontAwesomeIcon icon={faHotel} />} />
          <CardEstadistica titulo="Usuarios" valor={124} icono={<FontAwesomeIcon icon={faUser} />} />
          <CardEstadistica titulo="Reservas" valor={58} icono={<FontAwesomeIcon icon={faClipboardList} />} />
          <CardEstadistica titulo="Valoración Promedio" valor={`${calcularPromedioEstrellas()}`} icono={<FontAwesomeIcon icon={faStar} />} />
        </div>

        {/* Tabla de hoteles */}
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
                <tr key={hotel.Id} className="border-b hover:bg-gray-50">
                <td className="py-3">{hotel.Nombre}</td>
                <td className="py-3">{hotel.Pais}</td>
                <td className="py-3">{hotel.Ciudad}</td>
                <td className="py-3 text-center">{hotel.Estrellas}</td>
                <td className="py-3 text-center">
                    <button
                    onClick={() => handleAgregarHabitaciones(hotel.Id)}
                    className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 flex items-center justify-center gap-1 mx-auto"
                    >
                    <FontAwesomeIcon icon={faHotel}/> Agregar habitaciones
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
      </div>
    </div>
  );
}
