import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { appsettings } from "../settings/appsettings";
import Swal from 'sweetalert2'

export default function CrearCuenta() {
  
  const [paises, setPaises] = useState<string[]>([]);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    correo: "",
    contraseña: "",
    confirmar: "",
    telefono: "",
    genero: "",
    nacionalidad: "",
    dniPasaporte: "",
    estado: false,
  });

  useEffect(() => {
      fetch("https://countriesnow.space/api/v0.1/countries")
        .then((res) => res.json())
        .then((data) => {
          const nombresPaises = data.data.map((p: any) => p.country);
          setPaises(nombresPaises.sort());
        })
        .catch((err) => console.error("Error al cargar países:", err));
  }, []);
  

  const esMayorDeEdad = (fecha: string) => {
    const nacimiento = new Date(fecha);
    const hoy = new Date();
    const edad =
      hoy.getFullYear() -
      nacimiento.getFullYear() -
      (hoy < new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate()) ? 1 : 0);
    return edad >= 18;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (e.target instanceof HTMLInputElement && type === "checkbox") {
      setForm({
        ...form,
        [name]: e.target.checked,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validaciones
  if (!esMayorDeEdad(form.fechaNacimiento)) {
    Swal.fire({
      title: "Error",
      text: "Debes ser mayor de edad para crear una cuenta.",
      icon: "warning",
      confirmButtonText: "Entendido",
    });
    return;
  }

  if (form.contraseña !== form.confirmar) {
    Swal.fire({
    title: "Error",
    text: "Las contraseñas no coinciden.",
    icon: "warning",
    confirmButtonText: "Entendido",
  });
    return;
  }

  // Crear objeto usuario igual a tu modelo del backend
  const nuevoUsuario = {
    nombre: form.nombre,
    apellido: form.apellido,
    fechaNacimiento: form.fechaNacimiento,
    correo: form.correo,
    contraseña: form.contraseña,
    telefono: form.telefono,
    genero: form.genero,
    nacionalidad: form.nacionalidad,
    dniPasaporte: form.dniPasaporte,
    estado: form.estado,
  };

  try {
    const response = await fetch(`${appsettings.apiUrl}Usuario/Nuevo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoUsuario),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Usuario creado:", data);

    Swal.fire({
      title: "Drag me!",
      icon: "success",
      draggable: true
    });
    navigate("/"); // Redirige al inicio
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al crear la cuenta. Por favor, intenta nuevamente.",
    });
  }
};

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white shadow-2xl rounded-lg w-full max-w-4xl p-10">
          <h2 className="text-2xl font-bold text-center text-orange-500 mb-8">
            Crear cuenta
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  placeholder="Tu apellido"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">Fecha de nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={form.fechaNacimiento}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">Correo electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="ejemplo@gmail.com"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="+54 9 11..."
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm mb-1">Contraseña</label>
                <input
                  type="password"
                  name="contraseña"
                  value={form.contraseña}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">Confirmar contraseña</label>
                <input
                  type="password"
                  name="confirmar"
                  value={form.confirmar}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">Género</label>
                <select
                  name="genero"
                  value={form.genero}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Seleccionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">País / Nacionalidad</label>
                <select
                  name="nacionalidad"
                  value={form.nacionalidad}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Seleccionar país</option>
                  {paises.map((pais) => (
                    <option key={pais} value={pais}>
                      {pais}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">DNI / Pasaporte</label>
                <input
                  type="text"
                  name="dniPasaporte"
                  value={form.dniPasaporte}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-400"
                />
              </div>

            </div>

            {/* Botón ocupará toda la fila */}
            <div className="col-span-1 md:col-span-2">
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded transition"
              >
                Registrarse
              </button>

              <button
                onClick={() => navigate("/")}
                type="button"
                className="w-full mt-3 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded transition"
              >
                Volver al inicio
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
