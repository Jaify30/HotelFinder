import { useEffect, useState } from "react";
import { appsettings } from "../settings/appsettings";
import type { Reservas } from "../types/Reservas";
import type { ImgHoteles } from "../types/ImgHoteles";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function MisReservas() {
  const [reservas, setReservas] = useState<Reservas[]>([]);
  const [imagenes, setImagenes] = useState<ImgHoteles[]>([]);
  const [misResenias, setMisResenias] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioLocal = localStorage.getItem("usuario");
    if (!usuarioLocal) {
      Swal.fire({
        icon: "warning",
        title: "Debes iniciar sesión",
      });
      return;
    }

    const user = JSON.parse(usuarioLocal);
    const dni = user.dni;

    const fetchData = async () => {
      try {
        // 📌 Traer reservas
        const resReservas = await fetch(`${appsettings.apiUrl}Reserva/Lista`);
        const lista: Reservas[] = await resReservas.json();
        const misReservas = lista.filter((r) => r.clienteDni === dni);
        setReservas(misReservas);

        // 📌 Traer imágenes
        const resImagenes = await fetch(`${appsettings.apiUrl}ImgHoteles/Lista`);
        const imgs: ImgHoteles[] = await resImagenes.json();
        setImagenes(imgs);

        // 📌 Traer reseñas del usuario
        const resResenias = await fetch(`${appsettings.apiUrl}Resenias/Lista`);
        const listaRes = await resResenias.json();

        const mias = listaRes.filter((res: any) => res.clienteDni === dni);
        setMisResenias(mias);

      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error al cargar reservas",
        });
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  if (cargando) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-700">
        <h2 className="text-xl">Cargando reservas...</h2>
      </div>
    );
  }

  return (
    <>
      <Header></Header>
      <div className="min-h-screen px-6 py-10 bg-linear-to-b ">
    <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800 drop-shadow-sm">
      Mis Reservas
    </h1>

    {reservas.length === 0 ? (
      <p className="text-center text-xl text-gray-700">
        No tienes reservas todavía.
      </p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reservas.map((r) => {
          const img = imagenes.find((i) => i.idHotel === r.idHotel);
          const puedeResenar = new Date(r.fechaSalida) < new Date();
          const reseña = misResenias.find((x) => x.idReserva === r.id);

          return (
            <div
              key={r.id}
              className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Imagen */}
              <div className="relative">
                <img
                  src={
                    img
                      ? img.url.startsWith("http")
                        ? img.url
                        : `${appsettings.apiUrl.replace("api/", "")}${img.url}`
                      : "/hotel-default.jpg"
                  }
                  alt={r.hotelNombre}
                  className="h-48 w-full object-cover"
                />

                {/* Estado */}
                <span
                  className={`absolute top-3 left-3 px-3 py-1 text-sm font-semibold rounded-full shadow ${
                    r.estado === "Confirmada"
                      ? "bg-green-500 text-white"
                      : r.estado === "Cancelada"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-400 text-gray-900"
                  }`}
                >
                  {r.estado}
                </span>
              </div>

              {/* Info */}
              <div className="p-5">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {r.hotelNombre}
                </h2>

                <p className="text-gray-500 mb-3">
                  Habitación: <b>{r.habitacionTipo}</b>
                </p>

                <div className="space-y-1 text-gray-700">
                  <p>
                    <b>Entrada:</b>{" "}
                    {new Date(r.fechaEntrada).toLocaleDateString()}
                  </p>
                  <p>
                    <b>Salida:</b>{" "}
                    {new Date(r.fechaSalida).toLocaleDateString()}
                  </p>
                  <p>
                    <b>Huéspedes:</b> {r.cantidadHuespedes}
                  </p>
                </div>

                {/* Separador */}
                <div className="my-4 border-t border-gray-200"></div>

                {/* Si ya tiene reseña */}
                {reseña ? (
                  <div>
                    <p className="text-gray-700 mb-2">
                      <b>Tu reseña:</b> {reseña.descripcion}
                    </p>

                    {/* Estrellas */}
                    <p className="text-yellow-500 text-xl mb-4">
                      {"★".repeat(reseña.estrellas)}
                      {"☆".repeat(5 - reseña.estrellas)}
                    </p>

                    {/* Botón editar */}
                    <button
                      onClick={() =>
                        navigate("/CrearResena", {
                          state: {
                            reservaId: r.id,
                            idHotel: r.idHotel,
                            idCliente: r.idCliente,
                            hotelNombre: r.hotelNombre,
                            modo: "editar",
                            reseña: reseña,
                          },
                        })
                      }
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-semibold transition-all"
                    >
                      Editar Reseña
                    </button>
                  </div>
                ) : (
                  // Si NO tiene reseña
                  <button
                    disabled={!puedeResenar}
                    onClick={() =>
                      navigate("/CrearResena", {
                        state: {
                          reservaId: r.id,
                          idHotel: r.idHotel,
                          idCliente: r.idCliente,
                          hotelNombre: r.hotelNombre,
                        },
                      })
                    }
                    className={`w-full mt-2 py-3 rounded-xl text-lg font-semibold transition-all ${
                      puedeResenar
                        ? "bg-orange-500 hover:bg-orange-600 text-white shadow"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Dar Reseña
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
    </>
);

}
