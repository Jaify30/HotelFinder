import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { appsettings } from "../settings/appsettings";

import type { Hotel } from "../types/Hoteles";
import type { Habitaciones } from "../types/Habitaciones";
import type { ImgHoteles } from "../types/ImgHoteles";
import type { ImgHabitaciones } from "../types/ImgHabitaciones";
import type { Reservas } from "../types/Reservas";
import type { Reseñas } from "../types/Reseñas";

import HabitacionModal from "./HabitacionModal";

export default function HotelDashboard() {
  const { idHotel } = useParams();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [imagenesHotel, setImagenesHotel] = useState<string[]>([]);
  const [habitaciones, setHabitaciones] = useState<Habitaciones[]>([]);
  const [imagenesHabitaciones, setImagenesHabitaciones] = useState<ImgHabitaciones[]>([]);
  const [reservas, setReservas] = useState<Reservas[]>([]);
  const [reseñas, setReseñas] = useState<Reseñas[]>([]);

  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<number | null>(null);
  const [showHabitacionModal, setShowHabitacionModal] = useState(false);

  // ====================
  // CARGA INICIAL
  // ====================
  useEffect(() => {
    if (!idHotel) return;

    // HOTEL
    fetch(`${appsettings.apiUrl}Hotele/Obtener/${idHotel}`)
      .then(res => res.json())
      .then(data => {
        setHotel(data);

        const urls = data.imgHoteles?.map((img: ImgHoteles) =>
          img.url.startsWith("http")
            ? img.url
            : `${appsettings.apiUrl.replace("api/", "")}${img.url}`
        ) ?? [];

        setImagenesHotel(urls);
      });

    // HABITACIONES
    fetch(`${appsettings.apiUrl}Habitaciones/ListaPorHotel/${idHotel}`)
      .then(res => res.json())
      .then(setHabitaciones);

    // IMÁGENES HABITACIONES
    fetch(`${appsettings.apiUrl}ImgHabitacione/ListaPorHotel/${idHotel}`)
      .then(res => res.json())
      .then(setImagenesHabitaciones);

    // RESERVAS
    fetch(`${appsettings.apiUrl}Reserva/ListaPorHotel/${idHotel}`)
      .then(res => res.json())
      .then(setReservas);

    // RESEÑAS
    fetch(`${appsettings.apiUrl}Resenias/ListaPorHotel/${idHotel}`)
      .then(res => res.json())
      .then(setReseñas);

  }, [idHotel]);

  const obtenerImagenesHabitacion = (idHab: number) =>
    imagenesHabitaciones.filter((img) => img.idHabitacion === idHab);

  if (!hotel)
    return <p className="text-center text-gray-600 py-10">Cargando datos...</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* TÍTULO */}
      <h1 className="text-4xl font-bold text-gray-800 text-center">
        Panel del Hotel: {hotel.nombre}
      </h1>
      <p className="text-center text-gray-500 mb-6">
        {hotel.ciudad}, {hotel.pais} • ⭐{hotel.estrellas}
      </p>

      {/* IMÁGENES PRINCIPALES */}
      <div className="bg-white shadow p-6 rounded-xl mb-10">
        <h2 className="text-2xl font-semibold mb-3">Imágenes principales</h2>

        <div className="flex gap-3 overflow-x-auto">
          {imagenesHotel.map((url, i) => (
            <img
              key={i}
              src={url}
              className="w-32 h-32 object-cover rounded-lg border"
            />
          ))}
        </div>
      </div>

      {/* HABITACIONES */}
      <div className="bg-white shadow p-6 rounded-xl mb-10">
        <h2 className="text-2xl font-semibold mb-6">Habitaciones</h2>

        {habitaciones.length === 0 ? (
          <p className="text-gray-500">No hay habitaciones registradas.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {habitaciones.map((hab) => (
              <div
                key={hab.id}
                className="border rounded-xl p-4 bg-gray-50 shadow-sm"
              >
                <h3 className="text-xl font-semibold">{hab.tipo}</h3>
                <p className="text-gray-600">{hab.caracteristicas}</p>
                <p className="text-orange-500 font-bold">
                  ${hab.precio} / noche
                </p>

                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {obtenerImagenesHabitacion(hab.id).map((img) => (
                    <img
                      key={img.id}
                      src={`${appsettings.apiUrl.replace("api/", "")}${img.url}`}
                      className="w-20 h-20 rounded-md object-cover border"
                    />
                  ))}
                </div>

                <button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 mt-3 rounded-lg transition"
                  onClick={() => {
                    setHabitacionSeleccionada(hab.id);
                    setShowHabitacionModal(true);
                  }}
                >
                  Ver imágenes
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESERVAS */}
      <div className="bg-white shadow p-6 rounded-xl mb-10">
        <h2 className="text-2xl font-semibold mb-4">Reservas del hotel</h2>

        {reservas.length === 0 ? (
          <p className="text-gray-500">No hay reservas aún.</p>
        ) : (
          <div className="space-y-3">
            {reservas.map((r) => (
              <div key={r.id} className="border rounded-lg p-4">
                <p><strong>Cliente:</strong> {r.clienteNombre}</p>
                <p><strong>Habitación:</strong> {r.habitacionTipo}</p>
                <p><strong>Entrada:</strong> {new Date(r.fechaEntrada).toLocaleDateString()}</p>
                <p><strong>Salida:</strong> {new Date(r.fechaSalida).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESEÑAS */}
      <div className="bg-white shadow p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4">Reseñas</h2>

        {reseñas.length === 0 ? (
          <p className="text-gray-500">Sin reseñas por ahora.</p>
        ) : (
          <div className="space-y-4">
            {reseñas.map((r) => (
              <div key={r.id} className="border p-4 rounded-lg">
                <div className="flex justify-between">
                  <p className="font-semibold">{r.clienteNombre}</p>
                  <p className="text-yellow-500">{"⭐".repeat(r.estrellas)}</p>
                </div>
                <p className="mt-2">{r.descripcion}</p>
                <span className="text-sm text-gray-400">
                  {new Date(r.fecha).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE IMÁGENES */}
      <HabitacionModal
        habitacionId={habitacionSeleccionada}
        isOpen={showHabitacionModal}
        onClose={() => setShowHabitacionModal(false)}
      />
    </div>
  );
}
