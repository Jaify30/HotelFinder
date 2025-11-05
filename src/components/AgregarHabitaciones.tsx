import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { appsettings } from "../settings/appsettings";

export default function AgregarHabitaciones() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tipo, setTipo] = useState("");
  const [caracteristicas, setCaracteristicas] = useState("");
  const [precio, setPrecio] = useState("");
  const [maxHuespedes, setMaxHuespedes] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipo || !caracteristicas || !precio || !maxHuespedes) {
    setMensaje("⚠️ Todos los campos son obligatorios");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
    }

    const nuevaHabitacion = {
    Tipo: tipo,
    Caracteristicas: caracteristicas,
    Precio: Number(precio),
    MaxHuespedes: Number(maxHuespedes),
    IdHotel: Number(id)
    };

    try {
      const res = await fetch(`${appsettings.apiUrl}Habitaciones/Nuevo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaHabitacion),
      });

      if (res.ok) {
        setMensaje("✅ Habitación agregada correctamente");
        setTipo("");
        setCaracteristicas("");
        setPrecio("");
        setMaxHuespedes("");
        setTimeout(() => navigate("/AdminPanel"), 1500);
      } else {
        setMensaje("❌ Error al agregar la habitación");
      }
    } catch (error) {
      setMensaje("❌ Error de conexión con el servidor");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold text-orange-500 mb-4 text-center">
          Agregar Habitación
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Hotel ID: <span className="font-semibold">{id}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo */}
          <div>
            <label className="block text-gray-700 mb-1">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-400 outline-none"
              required
            >
              <option value="">Seleccionar tipo...</option>
              <option value="Individual">Individual</option>
              <option value="Doble">Doble</option>
              <option value="Suite">Suite</option>
            </select>
          </div>

          {/* Características */}
          <div>
            <label className="block text-gray-700 mb-1">Características</label>
            <textarea
              value={caracteristicas}
              onChange={(e) => setCaracteristicas(e.target.value)}
              className="w-full border rounded-lg p-2 h-24 focus:ring-2 focus:ring-orange-400 outline-none resize-none"
              placeholder="Ej: TV, Wi-Fi, baño privado, aire acondicionado..."
              required
            ></textarea>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-gray-700 mb-1">Precio Por Noche (USD)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
          </div>

          {/* Máx. Huéspedes */}
          <div>
            <label className="block text-gray-700 mb-1">Máx. Huéspedes</label>
            <input
              type="number"
              min="1"
              value={maxHuespedes}
              onChange={(e) => setMaxHuespedes(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Guardar Habitación
          </button>
        </form>

        {mensaje && (
          <p
            className={`text-center mt-4 font-medium ${
              mensaje.startsWith("✅")
                ? "text-green-600"
                : mensaje.startsWith("⚠️")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {mensaje}
          </p>
        )}

        <button
          onClick={() => navigate("/admin")}
          className="w-full mt-6 text-sm text-gray-600 hover:text-orange-500"
        >
          ← Volver al Panel
        </button>
      </div>
    </div>
  );
}
