import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { appsettings } from "../settings/appsettings";
import type { Hotel } from "../types/Hoteles";
import type { ImgHoteles } from "../types/ImgHoteles";
import type { Habitaciones } from "../types/Habitaciones";
import type { Reseñas } from "../types/Reseñas";
import Header from "./Header";
import ReservaModal from "./ReservaModal";
import LoginModal from "./LoginModal";

export default function VerHotel() {
  const { id } = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string>("");
  const [rol, setRol] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showReserva, setShowReserva] = useState(false);

  // Estados nuevos
  const [habitaciones, setHabitaciones] = useState<Habitaciones[]>([]);
  const [reseñas, setReseñas] = useState<Reseñas[]>([]);

  // 🔸 Leer rol desde localStorage
  useEffect(() => {
    const rolGuardado = localStorage.getItem("rol");
    if (rolGuardado) setRol(rolGuardado);
  }, []);

  // 🔸 Cargar hotel + imágenes
  useEffect(() => {
    if (id) {
      fetch(`${appsettings.apiUrl}Hotele/Obtener/${id}`)
        .then(async (res) => {
          if (!res.ok) throw new Error(await res.text());
          return res.json();
        })
        .then((data) => {
          setHotel(data);
          if (data.imgHoteles?.length > 0) {
            const fullUrls = data.imgHoteles.map((img: ImgHoteles) =>
              img.url.startsWith("http")
                ? img.url
                : `${appsettings.apiUrl.replace("api/", "")}${img.url}`
            );
            setImagenes(fullUrls);
            setImagenSeleccionada(fullUrls[0]);
          }
        })
        .catch((err) => console.error("Error al cargar hotel:", err));
    }
  }, [id]);

  // 🔸 Cargar habitaciones del hotel
  useEffect(() => {
    if (id) {
      fetch(`${appsettings.apiUrl}Habitaciones/ListaPorHotel/${id}`)
        .then(async (res) => {
          if (!res.ok) throw new Error(await res.text());
          return res.json();
        })
        .then((data) => setHabitaciones(data))
        .catch((err) => console.error("Error al cargar habitaciones:", err));
    }
  }, [id]);

  // 🔸 Cargar reseñas del hotel
  useEffect(() => {
    if (id) {
      fetch(`${appsettings.apiUrl}Resenias/ListaPorHotel/${id}`)
        .then(async (res) => {
          if (!res.ok) throw new Error(await res.text());
          return res.json();
        })
        .then((data) => setReseñas(data))
        .catch((err) => console.error("Error al cargar reseñas:", err));
    }
  }, [id]);

  if (!hotel)
    return (
      <p className="text-center py-10 text-gray-600 text-lg">
        Cargando hotel...
      </p>
    );

  return (
    <>
      <Header />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* 🏨 Nombre y ubicación */}
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
          {hotel.nombre}
        </h1>
        <p className="text-center text-gray-500 mb-6">
          {hotel.ciudad}, {hotel.pais}
        </p>
        <p className="text-center text-yellow-500 text-lg mb-8">
          {"⭐".repeat(hotel.estrellas)}
        </p>

        {/* 📸 Imagen principal */}
        {imagenSeleccionada && (
          <div className="mb-6">
            <img
              src={imagenSeleccionada}
              alt="Imagen del hotel"
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* 🖼️ Miniaturas */}
        {imagenes.length > 1 && (
          <div className="flex justify-center gap-3 flex-wrap">
            {imagenes.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Imagen ${i + 1}`}
                onClick={() => setImagenSeleccionada(url)}
                className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 transition ${
                  imagenSeleccionada === url
                    ? "border-orange-500 scale-105"
                    : "border-transparent hover:scale-105 hover:border-orange-300"
                }`}
              />
            ))}
          </div>
        )}

        {/* 📝 Descripción */}
        <div className="mt-8 text-gray-700 leading-relaxed text-justify bg-white rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Descripción
          </h2>
          <p>{hotel.descripcion}</p>
        </div>

        {/* 🛏️ Habitaciones */}
        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-orange-500 pl-2">
            Habitaciones disponibles
          </h2>
          {habitaciones.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {habitaciones.map((hab) => (
                <div
                  key={hab.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {hab.tipo}
                  </h3>
                  <p className="text-gray-600 mb-2">{hab.caracteristicas}</p>
                  <p className="text-sm text-gray-500 mb-1">
                    Máx. huéspedes:{" "}
                    <span className="font-semibold">{hab.maxHuespedes}</span>
                  </p>
                  <p className="text-lg font-bold text-orange-500">
                    ${hab.precio.toFixed(2)} USD/Noche
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay habitaciones disponibles.</p>
          )}
        </div>

        {/* 💬 Reseñas */}
        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-orange-500 pl-2">
            Reseñas de huéspedes
          </h2>
          {reseñas.length > 0 ? (
            <div className="space-y-4">
              {reseñas.map((r) => (
                <div key={r.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800">
                      {r.clienteNombre}
                    </p>
                    <p className="text-yellow-500">{"⭐".repeat(r.estrellas)}</p>
                  </div>
                  <p className="text-gray-600 mt-2">{r.descripcion}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(r.fecha).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Todavía no hay reseñas para este hotel.
            </p>
          )}
        </div>

        {/* 🔸 Botón de acción */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              if (!rol) setShowLogin(true);
              else if (rol === "user") setShowReserva(true);
            }}
            className={`px-6 py-3 rounded-full font-semibold transition text-white shadow-md ${
              rol === "user"
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {rol === "user" ? "Quiero Reservar" : "Inicia sesión para reservar"}
          </button>
        </div>
      </div>

      {/* 🔹 Modal de login */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

      {/* 🔹 Modal de reserva */}
      <ReservaModal
        hotelId={hotel.id}
        isOpen={showReserva}
        onClose={() => setShowReserva(false)}
        habitaciones={habitaciones}
        hotelNombre={hotel.nombre}
      />
    </>
  );
}
