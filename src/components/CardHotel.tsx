import { useState } from "react";
import type { ImgHoteles } from "../types/ImgHoteles";
import type { Hotel } from "../types/Hoteles";

interface Props {
  hotel: Hotel;
  imagenes: ImgHoteles[];
}

export default function CardHotel({ hotel, imagenes }: Props) {
  const { Id, Nombre, Descripcion, Pais, Ciudad, Estrellas } = hotel;
  const imagenHotel = imagenes.find((img) => img.ID_Hotel === Id);
  const [expandido, setExpandido] = useState(false); // 👈 estado para expandir o no

  // Limita el texto si no está expandido
  const textoMostrar = expandido
    ? Descripcion
    : Descripcion.length > 100
      ? Descripcion.slice(0, 100) + "..."
      : Descripcion;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <img
        src={imagenHotel ? imagenHotel.URL : "/no-image.png"}
        alt={Nombre}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col grow">
        <h3 className="text-lg font-semibold text-gray-800">{Nombre}</h3>
        <p className="text-sm text-gray-500">
          {Ciudad}, {Pais}
        </p>

        {/* 🔸 Descripción con ver más/ver menos */}
        <div className="mt-3 text-orange-500 font-medium leading-relaxed">
          {textoMostrar}
          {Descripcion.length > 100 && (
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
          {"★".repeat(Math.floor(Estrellas))}
          {"☆".repeat(5 - Math.floor(Estrellas))}
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
