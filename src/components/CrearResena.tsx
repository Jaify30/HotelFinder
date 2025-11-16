import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { appsettings } from "../settings/appsettings";

export default function CrearResena() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { reservaId, idHotel, idCliente, hotelNombre } = state || {};

  const [descripcion, setDescripcion] = useState("");
  const [estrellas, setEstrellas] = useState(0);
  const [hoverEstrellas, setHoverEstrellas] = useState(0);

  // ⛔ Validar que los datos existan
  useEffect(() => {
    if (!state || !idHotel || !idCliente || !reservaId) {
      Swal.fire({
        icon: "error",
        title: "Información incompleta",
        text: "No se pudo cargar la reserva.",
      });
      navigate("/MisReservas");
    }
  }, []);

  // 🔥 Si estamos editando, cargar datos previos
  useEffect(() => {
    if (state?.modo === "editar" && state?.reseña) {
      setDescripcion(state.reseña.descripcion);
      setEstrellas(state.reseña.estrellas);
    }
  }, []);

  // ────────────────────────────────────────────────
  // ENVIAR RESEÑA
  // ────────────────────────────────────────────────
  const enviarResena = async () => {
    if (estrellas === 0) {
      Swal.fire({ icon: "warning", title: "Selecciona una calificación" });
      return;
    }

    if (descripcion.trim().length < 10) {
      Swal.fire({ icon: "warning", title: "La reseña debe tener más texto" });
      return;
    }

    const esEdicion = state?.modo === "editar";

    const obj = {
      Id: esEdicion ? state.reseña.id : 0,
      IdHotel: idHotel,
      IdCliente: idCliente,
      IdReserva: reservaId,
      Descripcion: descripcion,
      Estrellas: estrellas,
      Fecha: esEdicion ? state.reseña.fecha : new Date() // 👈 obligatorio para PUT
    };

    const url = esEdicion
      ? `${appsettings.apiUrl}Resenias/Editar`
      : `${appsettings.apiUrl}Resenias/Nuevo`;

    const method = esEdicion ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: data?.mensaje || "Error al guardar la reseña",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: esEdicion ? "¡Reseña editada!" : "¡Reseña creada!",
        confirmButtonColor: "#f97316",
      });

      navigate("/MisReservas");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error inesperado" });
    }
  };

  // ────────────────────────────────────────────────
  // UI
  // ────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-b from-gray-100 to-gray-200 px-4 py-10">
      <div className="backdrop-blur-md bg-white/80 shadow-2xl rounded-2xl p-8 w-full max-w-xl border border-gray-200">

        <h1 className="text-3xl text-center font-bold text-orange-600 mb-1">
          {state?.modo === "editar" ? "Editar Reseña" : "Dejar una Reseña"}
        </h1>

        <p className="text-center text-gray-700 mb-6 text-lg font-medium">
          {hotelNombre}
        </p>

        {/* ESTRELLAS */}
        <div className="flex justify-center mb-8">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setEstrellas(n)}
              onMouseEnter={() => setHoverEstrellas(n)}
              onMouseLeave={() => setHoverEstrellas(0)}
              className={`
                text-5xl cursor-pointer mx-1 transition-all duration-150
                ${n <= (hoverEstrellas || estrellas)
                  ? "text-yellow-400 scale-110"
                  : "text-gray-300"}
              `}
            >
              ★
            </span>
          ))}
        </div>

        {/* TEXTO */}
        <label className="font-medium text-gray-700 mb-2 block">
          Tu opinión
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Escribe tu experiencia en este hotel..."
          className="w-full border border-gray-300 rounded-xl p-4 h-40 text-gray-800 focus:ring-2 focus:ring-orange-400 outline-none transition resize-none bg-white"
        />

        {/* BOTÓN ENVIAR */}
        <button
          onClick={enviarResena}
          className="w-full mt-8 py-3 text-lg font-semibold rounded-xl text-white bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition shadow-lg hover:shadow-xl"
        >
          {state?.modo === "editar" ? "Guardar Cambios" : "Enviar Reseña"}
        </button>

        {/* VOLVER */}
        <button
          onClick={() => navigate("/MisReservas")}
          className="w-full mt-4 py-2 rounded-xl text-gray-700 hover:text-orange-600 underline text-sm"
        >
          Volver a mis reservas
        </button>

      </div>
    </div>
  );
}
