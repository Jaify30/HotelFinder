import { useState } from "react";
import type { ImgHoteles } from "../types/ImgHoteles";
import type { Hotel } from "../types/Hoteles";
import { appsettings } from "../settings/appsettings";

interface Props {
  hotel: Hotel;
  imagenes: ImgHoteles[];
}

export default function CardHotel({ hotel, imagenes }: Props) {
  const { id, nombre, descripcion, pais, ciudad, estrellas } = hotel;
  const imagenHotel = imagenes.find((img) => img.id === id);
  const [expandido, setExpandido] = useState(false); // 👈 estado para expandir o no

  // Limita el texto si no está expandido
  const textoMostrar = expandido
    ? descripcion
    : descripcion.length > 100
    ? descripcion.slice(0, 100) + "..."
    : descripcion;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <img
        src={
          imagenHotel
            ? imagenHotel.url.startsWith("http")
              ? imagenHotel.url
              : `${appsettings.apiUrl.replace("api/", "")}${imagenHotel.url}`
            : "/hotel-default.jpg"
        }
        alt={nombre}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col grow">
        <h3 className="text-lg font-semibold text-gray-800">{nombre}</h3>
        <p className="text-sm text-gray-500">
          {ciudad}, {pais}
        </p>

        {/* 🔸 Descripción con ver más/ver menos */}
        <div className="mt-3 text-orange-500 font-medium leading-relaxed">
          {textoMostrar}
          {descripcion.length > 100 && (
            <button
              onClick={() => setExpandido(!expandido)}
              className="ml-1 text-orange-900 font-semibold hover:underline focus:outline-none"
            >
              {expandido ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>

        {/* Estrellas */}
        <div className="flex items-center text-yellow-500 mt-2">
          {"★".repeat(Math.floor(estrellas))}
          {"☆".repeat(5 - Math.floor(estrellas))}
        </div>

        {/* Botón inferior */}
        <div className="mt-auto">
          <button className="w-full cursor-pointer bg-orange-500 mt-4 text-white py-2 rounded hover:bg-orange-600 transition">
            Ver Hotel
          </button>
        </div>
      </div>
    </div>
  );
}
