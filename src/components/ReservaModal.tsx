import { useState } from "react";
import type { Habitaciones } from "../types/Habitaciones";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  habitaciones: Habitaciones[];
  hotelNombre: string;
  hotelId:number;
}

export default function ReservaModal({
  isOpen,
  onClose,
  habitaciones,
  hotelNombre,
  hotelId
}: Props) {
  const [habitacionId, setHabitacionId] = useState<number | null>(null);
  const [fechaEntrada, setFechaEntrada] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [cantidadHuespedes, setCantidadHuespedes] = useState(1);
  const [maxHuespedes, setMaxHuespedes] = useState<number>(1);

  const navigate = useNavigate();
  const hoy = new Date().toISOString().split("T")[0];

  if (!isOpen) return null;

  const handleHabitacionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setHabitacionId(id);

    const seleccionada = habitaciones.find((h) => h.id === id);
    if (seleccionada) {
      setMaxHuespedes(seleccionada.maxHuespedes || 1);
      if (cantidadHuespedes > seleccionada.maxHuespedes) {
        setCantidadHuespedes(seleccionada.maxHuespedes);
      }
    }
  };

  const incrementar = () => {
    setCantidadHuespedes((prev) => (prev < maxHuespedes ? prev + 1 : prev));
  };

  const disminuir = () => {
    setCantidadHuespedes((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleReservar = () => {
    if (!habitacionId || !fechaEntrada || !fechaSalida) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Por favor, completa los campos",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    const entrada = new Date(fechaEntrada);
    const salida = new Date(fechaSalida);

    if (salida <= entrada) {
      Swal.fire({
        icon: "error",
        title: "Fechas inválidas",
        text: "La fecha de salida debe ser posterior a la de entrada",
      });
      return;
    }

    const habitacionSeleccionada = habitaciones.find((h) => h.id === habitacionId);
    if (!habitacionSeleccionada) {
      Swal.fire({
        icon: "error",
        title: "Habitación no encontrada",
      });
      return;
    }

    if (cantidadHuespedes > maxHuespedes) {
      Swal.fire({
        icon: "error",
        title: "Límite de huéspedes superado",
        text: `El máximo permitido para esta habitación es ${maxHuespedes}.`,
      });
      return;
    }

    // ✅ Obtener los datos del usuario desde localStorage
    const usuarioLocal = localStorage.getItem("usuario");
    let clienteNombre = "";
    let clienteDni = "";
    let clienteCorreo = "";

    if (usuarioLocal) {
      const user = JSON.parse(usuarioLocal);
      clienteNombre = `${user.nombre} ${user.apellido}`;
      clienteDni = user.dni;
      clienteCorreo = user.correo;
    }

    // ✅ Navegar con todos los datos
    navigate("/PagosPage", {
      state: {
        hotelNombre,
        habitacionTipo: habitacionSeleccionada.tipo,
        precioPorNoche: habitacionSeleccionada.precio,
        fechaEntrada,
        fechaSalida,
        cantidadHuespedes,
        clienteNombre,
        clienteDni,
        clienteCorreo,
        hotelId
      },
    });

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
        <h2 className="text-2xl font-bold text-center text-orange-500 mb-1">
          Reservar en
        </h2>
        <p className="text-center text-gray-800 font-semibold mb-4">
          {hotelNombre}
        </p>

        {/* Seleccionar habitación */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de habitación
        </label>
        <select
          value={habitacionId ?? ""}
          onChange={handleHabitacionChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Selecciona una habitación</option>
          {habitaciones.map((h) => (
            <option key={h.id} value={h.id}>
              {h.tipo} - ${h.precio.toFixed(2)} (Máx: {h.maxHuespedes})
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
              min={hoy}
              onChange={(e) => {
                setFechaEntrada(e.target.value);
                if (fechaSalida && new Date(e.target.value) >= new Date(fechaSalida)) {
                  setFechaSalida("");
                }
              }}
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
              min={fechaEntrada || hoy}
              onChange={(e) => setFechaSalida(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* 👥 Cantidad de huéspedes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad de huéspedes
          </label>
          <div className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 w-full">
            <button
              onClick={disminuir}
              className="text-orange-500 font-bold text-xl px-2 hover:text-orange-600 transition"
            >
              −
            </button>
            <span className="text-gray-800 font-semibold text-lg">
              {cantidadHuespedes}
            </span>
            <button
              onClick={incrementar}
              className="text-orange-500 font-bold text-xl px-2 hover:text-orange-600 transition"
            >
              +
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            Máximo permitido: {maxHuespedes}
          </p>
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
