import { useEffect, useState } from "react";
import { appsettings } from "../settings/appsettings";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface Country {
  country: string;
  cities: string[];
}

export default function CrearHotel() {
  const navigate = useNavigate();

  // --------------------------
  // 📦 Estados principales
  // --------------------------
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    pais: "",
    ciudad: "",
    telefono: "",
    estrellas: 1,
  });

  const [imagenes, setImagenes] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // --------------------------
  // 🌍 Cargar países
  // --------------------------
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data.data))
      .catch((err) => console.error("Error cargando países:", err));
  }, []);

  // --------------------------
  // 📍 Cargar ciudades según país
  // --------------------------
  useEffect(() => {
    const country = countries.find((c) => c.country === selectedCountry);
    setCities(country ? country.cities : []);
    setSelectedCity("");
  }, [selectedCountry, countries]);

  // --------------------------
  // ✏️ Manejar inputs
  // --------------------------
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --------------------------
  // 📸 Manejar imágenes
  // --------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImagenes(files);
  };

  // --------------------------
  // 💾 Guardar hotel
  // --------------------------
  const GuardarHotel = async () => {
    if (!selectedCountry || !selectedCity) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Selecciona un país y una ciudad antes de continuar.",
      });
      return;
    }

    const dataToSend = {
      ...formData,
      pais: selectedCountry,
      ciudad: selectedCity,
    };

    try {
      setLoading(true);

      const response = await fetch(`${appsettings.apiUrl}Hotele/Nuevo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const result = await response.json();
      console.log("📦 Respuesta del backend:", result);

      const hotelId = result?.id;
      if (!hotelId || isNaN(hotelId)) {
        Swal.fire({
          icon: "error",
          title: "Error al crear el hotel",
          text: "El servidor no devolvió un ID válido.",
        });
        return;
      }

      Swal.fire({
        title: "Hotel creado correctamente",
        text: "¿Deseas subir imágenes del hotel?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Sí, subir imágenes",
        cancelButtonText: "No, más tarde",
      }).then(async (res) => {
        if (res.isConfirmed && imagenes.length > 0) {
          const subidaOK = await SubirImagenes(hotelId);
          if (subidaOK) {
            Swal.fire({
              icon: "success",
              title: "Imágenes subidas correctamente",
            }).then(() => navigate("/"));
          } else {
            Swal.fire({
              icon: "error",
              title: "Error al subir las imágenes",
              text: "El hotel fue creado, pero hubo un problema al subir las imágenes.",
            }).then(() => navigate("/"));
          }
        } else {
          navigate("/");
        }
      });
    } catch (err) {
      console.error("Error al guardar hotel:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el hotel. Revisá la consola.",
      });
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // 📤 Subir múltiples imágenes
  // --------------------------
  const SubirImagenes = async (idHotel?: number): Promise<boolean> => {
    if (!idHotel || isNaN(idHotel)) {
      console.error("❌ SubirImagenes: idHotel inválido o no definido:", idHotel);
      return false;
    }

    const formDataImg = new FormData();
    formDataImg.append("IdHotel", idHotel.toString());
    imagenes.forEach((img) => formDataImg.append("Archivos", img));

    try {
      const res = await fetch(`${appsettings.apiUrl}ImgHoteles/Subir`, {
        method: "POST",
        body: formDataImg,
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Error en subida:", err);
        return false;
      }

      console.log("✅ Imágenes subidas con ID hotel:", idHotel);
      return true;
    } catch (err) {
      console.error("Error al subir imágenes:", err);
      return false;
    }
  };

  // --------------------------
  // 📨 Envío del formulario
  // --------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    GuardarHotel();
  };

  // --------------------------
  // 🧱 Renderizado
  // --------------------------
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-l-4 border-orange-500 pl-3">
          Crear Hotel
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Nombre */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Hotel CurDev"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Ej: Av. Siempre Viva 742"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
            />
          </div>

          {/* País */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">País</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">-- Selecciona un país --</option>
              {countries.map((country) => (
                <option key={country.country} value={country.country}>
                  {country.country}
                </option>
              ))}
            </select>
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Ciudad</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedCountry}
            >
              <option value="">-- Selecciona una ciudad --</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: +541155555555"
              pattern="^\+?\d*$"
              title="Solo se permiten números y el signo +"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
            />
          </div>

          {/* Estrellas */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Estrellas</label>
            <select
              name="estrellas"
              value={formData.estrellas}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} ⭐
                </option>
              ))}
            </select>
          </div>

          {/* Imágenes */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm mb-1">
              Imágenes del hotel
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
            />
            {imagenes.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {imagenes.length} imagen(es) seleccionada(s)
              </p>
            )}
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={4}
              placeholder="Describe el hotel, servicios, ubicación..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none resize-none"
            ></textarea>
          </div>

          {/* Botón */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white shadow-md transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {loading ? "Guardando..." : "Crear Hotel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
