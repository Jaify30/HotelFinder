import { useState } from "react";
import type { Habitaciones } from "../types/Habitaciones";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  habitaciones: Habitaciones[];
  hotelNombre: string;
}

export default function ReservaModal({ isOpen, onClose, habitaciones, hotelNombre }: Props) {
  const [habitacionId, setHabitacionId] = useState<number | null>(null);
  const [fechaEntrada, setFechaEntrada] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");

  if (!isOpen) return null;

  const handleReservar = () => {
    if (!habitacionId || !fechaEntrada || !fechaSalida) {
      alert("⚠️ Completa todos los campos antes de continuar");
      return;
    }

    // 🚀 En el futuro, acá harías un POST a tu backend
    alert(
      `✅ Reserva confirmada en ${hotelNombre}\nHabitación ID: ${habitacionId}\nDel ${fechaEntrada} al ${fechaSalida}`
    );

    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-lg w-96 p-6 relative"
      >
        <h2 className="text-2xl font-bold text-center text-orange-500 mb-4">
          Reservar en {hotelNombre}
        </h2>

        {/* Seleccionar habitación */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de habitación
        </label>
        <select
          value={habitacionId ?? ""}
          onChange={(e) => setHabitacionId(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Selecciona una habitación</option>
          {habitaciones.map((h) => (
            <option key={h.id} value={h.id}>
              {h.tipo} - ${h.precio.toFixed(2)}
            </option>
          ))}
        </select>

        {/* Fechas */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de entrada
            </label>
            <input
              type="date"
              value={fechaEntrada}
              onChange={(e) => setFechaEntrada(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de salida
            </label>
            <input
              type="date"
              value={fechaSalida}
              onChange={(e) => setFechaSalida(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleReservar}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Confirmar reserva
          </button>
        </div>
      </div>
    </div>
  );
}
