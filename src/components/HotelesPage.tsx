import { useState, useEffect } from "react";
import { appsettings } from "../settings/appsettings";
import type { Hotel } from "../types/Hoteles";
import Header from "./Header";



export default function HotelesPage() {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [filtered, setFiltered] = useState<Hotel[]>([]);

  // filtros
  const [pais, setPais] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [estrellas, setEstrellas] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");

  // Listas dropdowns
  const [paises, setPaises] = useState<string[]>([]);
  const [ciudades, setCiudades] = useState<string[]>([]);

  // 🔸 Cargar países desde la API de countriesnow
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries")
      .then((res) => res.json())
      .then((data) => {
        const nombresPaises = data.data.map((p: any) => p.country);
        setPaises(nombresPaises.sort());
      })
      .catch((err) => console.error("Error al cargar países:", err));
  }, []);

  // 🔸 Cargar ciudades cuando se elige un país
  useEffect(() => {
    if (!pais) {
      setCiudades([]);
      return;
    }

    fetch("https://countriesnow.space/api/v0.1/countries/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: pais }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCiudades(data.data.sort());
      })
      .catch((err) => console.error("Error al cargar ciudades:", err));
  }, [pais]);

  // 🔸 Cargar hoteles desde tu API
  useEffect(() => {
    fetch(`${appsettings.apiUrl}Hotele/Lista`) // 👈 corregido
      .then((res) => res.json())
      .then((data: Hotel[]) => {
        setHoteles(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Error al cargar hoteles:", err));
  }, []);

  // 🔸 Reset de filtros
  const resetFiltros = () => {
    setPais("");
    setCiudad("");
    setEstrellas(null);
    setNombre("");
    setFiltered(hoteles);
  };

  // 🔸 Aplicar filtros
  useEffect(() => {
    let result = hoteles;

    if (pais) result = result.filter((h) => h.pais.toLowerCase().includes(pais.toLowerCase()));
    if (ciudad) result = result.filter((h) => h.ciudad.toLowerCase().includes(ciudad.toLowerCase()));
    if (estrellas !== null) result = result.filter((h) => h.estrellas === estrellas);
    if (nombre) result = result.filter((h) => h.nombre.toLowerCase().includes(nombre.toLowerCase()));

    setFiltered(result);
  }, [pais, ciudad, estrellas, nombre, hoteles]);

  return (
    <>
      <Header/>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-3">
          Hoteles disponibles
        </h2>

        {/* FILTROS */}
        <div className="bg-white shadow-md rounded-xl p-5 mb-8 flex flex-wrap gap-4 items-center">
          {/* Buscar por nombre */}
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-60 focus:outline-none focus:ring-orange-500"
          />

          {/* País */}
          <select
            value={pais}
            onChange={(e) => {
              setPais(e.target.value);
              setCiudad("");
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 w-48 focus:outline-none focus:ring-orange-500"
          >
            <option value="">--Seleccionar País--</option>
            {paises.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Ciudad */}
          <select
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            disabled={!pais}
            className={`border border-gray-300 rounded-lg px-3 py-2 w-56 focus:outline-none ${
              pais ? "focus:ring-2 focus:ring-orange-500" : "bg-gray-100 cursor-not-allowed"
            }`}
          >
            <option value="">{pais ? "Seleccionar ciudad..." : "Seleccione un país primero"}</option>
            {ciudades.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Estrellas */}
          <select
            value={estrellas ?? ""}
            onChange={(e) => setEstrellas(e.target.value ? parseInt(e.target.value) : null)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Todas las estrellas</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="2">⭐⭐</option>
            <option value="1">⭐</option>
          </select>

          {/* Botón limpiar */}
          <button
            onClick={resetFiltros}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Limpiar filtros
          </button>
        </div>

        {/* LISTADO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filtered.length > 0 ? (
                filtered.map((hotel, index) => (
            <div
              key={hotel.id ?? index} // usa id si existe, si no el índice
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={
                  hotel.imagenUrl
                    ? hotel.imagenUrl.startsWith("http")
                      ? hotel.imagenUrl
                      : `${appsettings.apiUrl.replace("api/", "")}${hotel.imagenUrl}`
                    : "/hotel-default.jpg"
                }
                alt={hotel.nombre}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{hotel.nombre}</h3>
                <p className="text-gray-500 text-sm">
                  {hotel.ciudad}, {hotel.pais}
                </p>
                <p className="mt-1 text-yellow-500">{"⭐".repeat(hotel.estrellas)}</p>
                <p className="text-gray-600 mt-2 line-clamp-2">{hotel.descripcion}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-gray-600 text-center py-10">
            No se encontraron hoteles que coincidan con los filtros aplicados.
          </p>
        )}

        </div>
      </div>
    </>
  );
}
