import { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import CardEstadistica from "../components/CardEstadistica";
import {
  faClipboardList,
  faHotel,
  faPencil,
  faStar,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { appsettings } from "../settings/appsettings";
import { useNavigate } from "react-router-dom";
import type { Hotel } from "../types/Hoteles";
import type { Usuario } from "../types/Usuarios";
import type { Reservas } from "../types/Reservas";
import type { Reseñas } from "../types/Reseñas";
import { Eliminar } from "../Hooks/EliminarHook";
import { useContadores } from "../Hooks/useContador";

export default function AdminPanel() {
  const [listaHoteles, setListaHoteles] = useState<Hotel[]>([]);
  const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([]);
  const [listaReservas, setListaReservas] = useState<Reservas[]>([]);
  const [listaReseñas, setListaReseñas] = useState<Reseñas[]>([]);
  const [seccion, setSeccion] = useState("hoteles");
  const navigate = useNavigate();

  const {
    usuarios,
    reseñas,
    hoteles,
    reservas,
    promedioEstrellas,
    loading,
    error,
    refetch,
  } = useContadores();

  useEffect(() => {
    const rol = localStorage.getItem("rol");
    if (rol !== "admin") navigate("/");
  }, [navigate]);

  // 🔹 Cargar hoteles
  useEffect(() => {
    fetch(`${appsettings.apiUrl}Hotele/Lista`)
      .then((res) => res.json())
      .then(setListaHoteles)
      .catch(console.error);
  }, []);

  // 🔹 Cargar usuarios
  useEffect(() => {
    fetch(`${appsettings.apiUrl}Usuario/Lista`)
      .then((res) => res.json())
      .then(setListaUsuarios)
      .catch(console.error);
  }, []);

  // 🔹 Cargar reservas
  useEffect(() => {
    fetch(`${appsettings.apiUrl}Reserva/Lista`)
      .then((res) => res.json())
      .then(setListaReservas)
      .catch(console.error);
  }, []);

  // 🔹 Cargar reseñas
  useEffect(() => {
  fetch(`${appsettings.apiUrl}Resenias/Lista`)
    .then((res) => {
      if (!res.ok) throw new Error("Error al cargar reseñas");
      return res.json();
    })
    .then(setListaReseñas)
    .catch(console.error);
}, []);

  const handleAgregarHabitaciones = (id: number) => {
    navigate(`/AgregarHabitaciones/${id}`);
  };

  if (loading)
    return <p className="text-center mt-6">Cargando estadísticas...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="flex">
      <Sidebar setSeccion={setSeccion} />

      <div className="flex-1 bg-gray-100 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Panel de Administración —{" "}
          {seccion.charAt(0).toUpperCase() + seccion.slice(1)}
        </h1>

        {/* 🔹 Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <CardEstadistica
            titulo="Hoteles"
            valor={hoteles}
            icono={<FontAwesomeIcon icon={faHotel} />}
          />
          <CardEstadistica
            titulo="Usuarios"
            valor={usuarios}
            icono={<FontAwesomeIcon icon={faUser} />}
          />
          <CardEstadistica
            titulo="Reservas"
            valor={reservas}
            icono={<FontAwesomeIcon icon={faClipboardList} />}
          />
          <CardEstadistica
            titulo="Valoraciones"
            valor={reseñas}
            icono={<FontAwesomeIcon icon={faStar} />}
          />
          <CardEstadistica
            titulo="Promedio de Estrellas"
            valor={promedioEstrellas}
            icono={<FontAwesomeIcon icon={faStar} />}
          />
        </div>

        {/* 🔹 Sección Hoteles */}
        {seccion === "hoteles" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Hoteles Registrados
            </h2>
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
                {listaHoteles.map((hotel) => (
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
            {listaHoteles.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No hay hoteles registrados.
              </p>
            )}
          </div>
        )}

        {/* 🔹 Sección Usuarios */}
        {seccion === "usuarios" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Usuarios Registrados
            </h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2">Apellido y Nombre</th>
                  <th className="py-2">Correo</th>
                  <th className="py-2 text-center">Teléfono</th>
                  <th className="py-2 text-center">Género</th>
                  <th className="py-2 text-center">DNI / Pasaporte</th>
                  <th className="py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listaUsuarios.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      {u.apellido}, {u.nombre}
                    </td>
                    <td className="py-3">{u.correo}</td>
                    <td className="py-3 text-center">{u.telefono}</td>
                    <td className="py-3 text-center">{u.genero}</td>
                    <td className="py-3 text-center">{u.dniPasaporte}</td>
                    <td className="py-3 text-center flex justify-center">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1">
                        <FontAwesomeIcon icon={faPencil} /> Editar
                      </button>
                      <button
                        onClick={() =>
                          Eliminar("Usuario", u.id, () => {
                            setListaUsuarios((prev) =>
                              prev.filter((user) => user.id !== u.id)
                            );
                            refetch();
                          })
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-2 flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {listaUsuarios.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No hay usuarios registrados.
              </p>
            )}
          </div>
        )}

        {/* 🔹 Sección Valoraciones */}
        {seccion === "valoraciones" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Reseñas y Valoraciones
            </h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2">Hotel</th>
                  <th className="py-2">Cliente</th>
                  <th className="py-2 text-center">DNI/Pasaporte</th>
                  <th className="py-2 text-center">Estrellas</th>
                  <th className="py-2">Descripción</th>
                  <th className="py-2 text-center">Fecha</th>
                  <th className="py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listaReseñas.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{r.hotelNombre}</td>
                    <td className="py-3">{r.clienteNombre}</td>
                    <td className="py-3 text-center">{r.clienteDni}</td>
                    <td className="py-3 text-center text-yellow-500">
                      {"⭐".repeat(r.estrellas)}
                    </td>
                    <td className="py-3">{r.descripcion}</td>
                    <td className="py-3 text-center">{r.fecha}</td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() =>
                          Eliminar("Resenias", r.id, () => {
                            setListaReseñas((prev) =>
                              prev.filter((rev) => rev.id !== r.id)
                            );
                            refetch();
                          })
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-2 cursor-pointer flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {listaReseñas.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No hay reseñas registradas.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
