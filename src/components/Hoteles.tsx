import { useEffect, useState } from "react";
import CardHotel from "./CardHotel";
import { appsettings } from "../settings/appsettings";
import type { Hotel } from "../types/Hoteles";
import type { ImgHoteles } from "../types/ImgHoteles";

export default function Hoteles() {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [imagenes, setImagenes] = useState<ImgHoteles[]>([]);
  const [mostrarTodos, setMostrarTodos] = useState(false); // 👈 nuevo estado

  // 🔸 Cargar hoteles
  useEffect(() => {
    fetch(`${appsettings.apiUrl}Hotele/Lista`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const hotelesNormalizados = data.map((h) => ({
          id: h.id ?? h.Id,
          nombre: h.nombre ?? h.Nombre,
          descripcion: h.descripcion ?? h.Descripcion,
          pais: h.pais ?? h.Pais,
          ciudad: h.ciudad ?? h.Ciudad,
          estrellas: h.estrellas ?? h.Estrellas,
          direccion: h.direccion ?? h.Direccion,
          telefono: h.telefono ?? h.Telefono,
        }));
        setHoteles(hotelesNormalizados);
      })
      .catch((err) => console.error("Error al cargar hoteles:", err));
  }, []);

  // 🔸 Cargar imágenes
  useEffect(() => {
    fetch(`${appsettings.apiUrl}ImgHoteles/Lista`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const imgsNormalizadas = data.map((img) => ({
          ID: img.id ?? img.Id,
          ID_Hotel: img.id_Hotel ?? img.ID_Hotel,
          URL: img.url ?? img.URL,
        }));
        setImagenes(imgsNormalizadas);
      })
      .catch((err) => console.error("Error al cargar imágenes:", err));
  }, []);

  // 🔸 Filtrar los 6 más valorados por estrellas
  const hotelesTop = [...hoteles].sort((a, b) => b.estrellas - a.estrellas).slice(0, 6);

  // 🔸 Mostrar los primeros 3 o los 6 según el estado
  const hotelesVisibles = mostrarTodos ? hotelesTop : hotelesTop.slice(0, 3);

  return (
    <div className="mt-10 relative w-full max-w-7xl mx-auto overflow-hidden rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-orange-500 pl-3">
        Los Más Valorados
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotelesVisibles.map((hotel) => {
          const imagenHotel = imagenes.find((img) => img.ID_Hotel === hotel.id);
          return (
            <CardHotel
              key={hotel.id}
              hotel={hotel}
              imagenes={imagenHotel ? [imagenHotel] : []}
            />
          );
        })}
      </div>

      {/* 🔸 Botón para ver más o menos */}
      {hotelesTop.length > 3 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setMostrarTodos(!mostrarTodos)}
            className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition font-medium shadow-md"
          >
            {mostrarTodos ? "Ver menos ▲" : "Ver más ▼"}
          </button>
        </div>
      )}
    </div>
  );
}
