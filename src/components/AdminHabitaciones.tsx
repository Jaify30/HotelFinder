import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { appsettings } from "../settings/appsettings";
import type { Habitaciones } from "../types/Habitaciones";
import type { ImgHabitaciones } from "../types/ImgHabitaciones";
import Header from "./Header";

export default function AdminHabitaciones() {
  const { idHotel } = useParams();
  const [habitaciones, setHabitaciones] = useState<Habitaciones[]>([]);
  const [imagenes, setImagenes] = useState<ImgHabitaciones[]>([]);
  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState<File[]>([]);

  // Cargar habitaciones
  useEffect(() => {
    fetch(`${appsettings.apiUrl}Habitaciones/ListaPorHotel/${idHotel}`)
      .then(res => res.json())
      .then(setHabitaciones)
      .catch(console.error);
  }, [idHotel]);

  // Cargar imágenes
  const cargarImagenes = () => {
    fetch(`${appsettings.apiUrl}ImgHabitacione/ListaPorHotel/${idHotel}`)
      .then(res => res.json())
      .then(setImagenes)
      .catch(console.error);
  };

  useEffect(cargarImagenes, [idHotel]);

  const obtenerImagenesHabitacion = (idHab: number) =>
    imagenes.filter((img) => img.idHabitacion === idHab);

  return (
    <>
        <Header></Header>
        <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-orange-500 pl-3">
        Habitacion del hotel #{idHotel}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habitaciones.map((hab) => (
          <div
            key={hab.id}
            className="border rounded-2xl p-5 bg-white shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{hab.tipo}</h2>
            <p className="text-gray-600">{hab.caracteristicas}</p>
            <p className="mt-1 text-sm text-gray-500">
              Máx: {hab.maxHuespedes}
            </p>
            <p className="text-orange-500 font-bold text-lg mt-1">
              ${hab.precio} USD/Noche
            </p>

            {/* IMÁGENES */}
            <div className="mt-4 flex gap-3 flex-wrap">
              {obtenerImagenesHabitacion(hab.id).map((img) => (
                <div
                  key={img.id}
                  className="relative group"
                >
                  <img
                    src={`${appsettings.apiUrl.replace("api/", "")}${img.url}`}
                    className="w-24 h-24 object-cover rounded-xl border shadow-sm"
                  />

                  {/* BOTÓN BORRAR */}
                  <button
                    onClick={async () => {
                      await fetch(`${appsettings.apiUrl}ImgHabitacione/Eliminar/${img.id}`, {
                        method: "DELETE",
                      });
                      cargarImagenes();
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full text-xs 
                               flex items-center justify-center opacity-0 group-hover:opacity-100 
                               transition shadow-md"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* SUBIR IMÁGENES */}
            <div className="mt-5">
              <h3 className="font-semibold mb-2">Agregar imágenes</h3>

              {/* FILE INPUT */}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files ? Array.from(e.target.files) : [];
                  setImagenesSeleccionadas(files);
                }}
                className="bg-gray-100 border p-2 rounded-md w-full cursor-pointer"
              />

              {/* PREVIEW */}
              {imagenesSeleccionadas.length > 0 && (
                <div className="flex gap-3 flex-wrap mt-3">
                  {imagenesSeleccionadas.map((file, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(file)}
                      className="w-20 h-20 object-cover rounded-xl border shadow"
                    />
                  ))}
                </div>
              )}

              {/* BOTÓN SUBIR */}
              {imagenesSeleccionadas.length > 0 && (
                <button
                  onClick={async () => {
                    const formData = new FormData();
                    imagenesSeleccionadas.forEach((img) =>
                      formData.append("Archivos", img)
                    );
                    formData.append("IdHabitacion", hab.id.toString());

                    await fetch(`${appsettings.apiUrl}ImgHabitacione/SubirVarias`, {
                      method: "POST",
                      body: formData,
                    });

                    cargarImagenes();
                    setImagenesSeleccionadas([]);
                  }}
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-600 
                             text-white px-4 py-2 rounded-lg font-semibold shadow-md"
                >
                  Subir imágenes
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
