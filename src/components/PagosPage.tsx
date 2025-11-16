import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import type { Reservas } from "../types/Reservas";
import type { Pagos } from "../types/Pagos";
import { appsettings } from "../settings/appsettings";

interface ReservaState {
  hotelId:number;
  hotelNombre: string;
  habitacionTipo: string;
  precioPorNoche: number;
  fechaEntrada: string;
  fechaSalida: string;
  cantidadHuespedes: number;
  clienteDni: string;
  clienteNombre?: string;
  clienteCorreo?: string;
}

export default function PagosPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    hotelId,
    hotelNombre,
    habitacionTipo,
    precioPorNoche,
    fechaEntrada,
    fechaSalida,
    cantidadHuespedes,
    clienteDni,
    clienteNombre,
    clienteCorreo,
  } = (state as ReservaState) || {};

  const [metodo, setMetodo] = useState<"tarjeta" | "efectivo" | "">("");
  const [nombreTitular, setNombreTitular] = useState("");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [correo, setCorreo] = useState(clienteCorreo || "");

  if (!hotelNombre) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        <h2 className="text-xl font-semibold">
          ⚠️ No hay información de reserva disponible.
        </h2>
      </div>
    );
  }

  const noches = dayjs(fechaSalida).diff(dayjs(fechaEntrada), "day");
  const montoTotal = precioPorNoche * noches;

  useEffect(() => {
    const usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal) {
      const user = JSON.parse(usuarioLocal);
      setCorreo(user.correo || clienteCorreo || "");
    }
  }, []);

  // 🔹 Validar número de tarjeta con regex (Visa/MasterCard)
  const validarTarjeta = (numero: string): boolean => {
  // Eliminar espacios o guiones
  const limpio = numero.replace(/[\s-]/g, "");

  // Expresiones regulares actualizadas
  const regexVisa = /^4[0-9]{12}(?:[0-9]{3})?$/;
  const regexMaster =
    /^(5[1-5][0-9]{14}|2(2[2-9][0-9]{12}|[3-6][0-9]{13}|7[01][0-9]{12}|720[0-9]{12})|50[0-9]{14}|56[0-9]{14}|57[0-9]{14}|58[0-9]{14}|59[0-9]{14}|6[0-9]{15})$/;

  return regexVisa.test(limpio) || regexMaster.test(limpio);
};

  // 🔹 Validar vencimiento (no puede ser menor al mes actual)
  const validarVencimiento = (valor: string): boolean => {
    if (!valor) return false;
    const [año, mes] = valor.split("-").map(Number);
    const hoy = new Date();
    const añoActual = hoy.getFullYear();
    const mesActual = hoy.getMonth() + 1;
    return año > añoActual || (año === añoActual && mes >= mesActual);
  };

  const handlePagar = async () => {
  if (!metodo) {
    Swal.fire({
      icon: "warning",
      title: "Selecciona un método de pago",
      timer: 2500,
      showConfirmButton: false,
    });
    return;
  }

  // Validaciones para tarjeta
  if (metodo === "tarjeta") {
    if (!nombreTitular || !numeroTarjeta || !vencimiento || !cvv) {
      Swal.fire({
        icon: "warning",
        title: "Completa los datos de la tarjeta",
      });
      return;
    }

    if (!validarTarjeta(numeroTarjeta)) {
      Swal.fire({
        icon: "error",
        title: "Número de tarjeta inválido",
        text: "Verifica que sea Visa o MasterCard válido.",
      });
      return;
    }

    if (!validarVencimiento(vencimiento)) {
      Swal.fire({
        icon: "error",
        title: "Tarjeta vencida",
        text: "La fecha de vencimiento debe ser igual o posterior al mes actual.",
      });
      return;
    }
  }

  const pagoData = {
  hotelId,
  clienteDni,
  hotelNombre,
  habitacionTipo,
  fechaEntrada: new Date(fechaEntrada).toISOString(),
  fechaSalida: new Date(fechaSalida).toISOString(),
  cantidadHuespedes,
  metodo,
  monto: montoTotal,
};

  try {
    const res = await fetch(`${appsettings.apiUrl}Pago/Nuevo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pagoData),
    });

    if (!res.ok) throw new Error("Error en el pago");

    // 🔹 Parsear respuesta con tipos
    const data: {
      mensaje: string;
      reserva: Reservas;
      pago: Pagos;
    } = await res.json();

    await Swal.fire({
      icon: "success",
      title: "Pago realizado correctamente ✅",
      html: `
        <b>${data.mensaje}</b><br/><br/>
        <b>Hotel:</b> ${data.reserva.hotelNombre}<br/>
        <b>Habitación:</b> ${data.reserva.habitacionTipo}<br/>
        <b>Cliente:</b> ${data.reserva.clienteNombre}<br/>
        <b>DNI:</b> ${data.reserva.clienteDni}<br/>
        <b>Total:</b> $${data.pago.monto.toFixed(2)}<br/>
        <b>Método:</b> ${data.pago.metodo}<br/>
        <b>Fecha:</b> ${new Date(data.pago.fecha).toLocaleString()}
      `,
      confirmButtonColor: "#f97316",
    });

    navigate("/"); // ✅ volver al inicio
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error al procesar el pago",
      text: "Intenta nuevamente más tarde.",
    });
  }
  console.log("Datos enviados al backend:", pagoData);
}

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-orange-500 mb-6">
          Pago de la reserva
        </h2>

        {/* 🧾 Resumen */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
          <h3 className="font-semibold text-gray-800 mb-2">Resumen</h3>
          <p><b>Hotel:</b> {hotelNombre}</p>
          <p><b>Habitación:</b> {habitacionTipo}</p>
          <p><b>Cliente:</b> {clienteNombre || "Desconocido"}</p>
          <p><b>DNI:</b> {clienteDni || "N/A"}</p>
          <p><b>Correo:</b> {correo || "N/A"}</p>
          <p><b>Huéspedes:</b> {cantidadHuespedes}</p>
          <p>
            <b>Del:</b> {dayjs(fechaEntrada).format("DD/MM/YYYY")} al{" "}
            {dayjs(fechaSalida).format("DD/MM/YYYY")}
          </p>
          <p><b>Noches:</b> {noches}</p>
          <p className="text-right text-gray-800 font-bold mt-2">
            Total: ${montoTotal.toFixed(2)}
          </p>
        </div>

        {/* 💳 Método de pago */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Método de pago
          </label>
          <div className="flex gap-4">
            <button
              className={`flex-1 py-2 rounded-lg border ${
                metodo === "tarjeta"
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setMetodo("tarjeta")}
            >
              Tarjeta
            </button>
            <button
              className={`flex-1 py-2 rounded-lg border ${
                metodo === "efectivo"
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setMetodo("efectivo")}
            >
              Efectivo
            </button>
          </div>
        </div>

        {/* 💳 Campos de tarjeta */}
        {metodo === "tarjeta" && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nombre del titular"
              value={nombreTitular}
              onChange={(e) => setNombreTitular(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <input
              type="text"
              placeholder="Número de tarjeta (Visa o MasterCard)"
              value={numeroTarjeta}
              onChange={(e) => setNumeroTarjeta(e.target.value)}
              maxLength={16}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <div className="flex gap-3">
              <input
                type="month"
                value={vencimiento}
                onChange={(e) => setVencimiento(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <input
                type="password"
                placeholder="CVV"
                value={cvv}
                maxLength={3}
                onChange={(e) => setCvv(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ciudad"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <input
                type="text"
                placeholder="Código postal"
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* ✅ Botón Confirmar */}
        <button
          onClick={handlePagar}
          className="w-full mt-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-lg font-semibold"
        >
          Confirmar pago
        </button>
      </div>
    </div>
  );
}
