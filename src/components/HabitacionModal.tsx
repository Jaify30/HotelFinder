import { useEffect, useState } from "react";
import { appsettings } from "../settings/appsettings";

interface Props {
  habitacionId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ImgHabitacion {
  id: number;
  url: string;
}

export default function HabitacionModal({ habitacionId, isOpen, onClose }: Props) {
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [imagenActual, setImagenActual] = useState<string>("");


  useEffect(() => {
    if (habitacionId && isOpen) {
      fetch(`${appsettings.apiUrl}ImgHabitacione/ListaPorHabitacion/${habitacionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) {
            const urls = data.map((img: ImgHabitacion) =>
              img.url.startsWith("http")
                ? img.url
                : `${appsettings.apiUrl.replace("api/", "")}${img.url}`
            );
            setImagenes(urls);
            setImagenActual(urls[0]);
          }
        });
    }
  }, [habitacionId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-4 max-w-3xl w-full shadow-lg relative">

        {/* Botón cerrar */}
        <button
          className="absolute top-2 right-2 text-gray-600 text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Imágenes de la Habitación
        </h2>

        {imagenActual && (
        <div className="w-full max-h-[60vh] flex justify-center items-center overflow-hidden rounded-lg shadow mb-4">
  <img src={imagenActual} className="max-h-[60vh] object-contain" />
</div>

        )}

        {/* Miniaturas */}
        <div className="flex gap-3 justify-center flex-wrap">
        {imagenes.map((img, i) => (
            <img
            key={i}
            src={img}
            onClick={() => setImagenActual(img)}
            className={`w-24 h-24 rounded-lg object-cover cursor-pointer border-2 ${
                imagenActual === img
                ? "border-orange-500 scale-105"
                : "border-transparent hover:border-orange-300"
            } transition`}
            />
        ))}
        </div>

      </div>
    </div>
  );
}
