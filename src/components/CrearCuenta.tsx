import { useNavigate } from "react-router-dom";
import Header from "./Header"

export default function CrearCuenta() {
    const navigate = useNavigate();
    const esMayorDeEdad = (fecha: string) => {
        const nacimiento = new Date(fecha);
        const hoy = new Date();
        const edad =
        hoy.getFullYear() -
        nacimiento.getFullYear() -
        (hoy < new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate()) ? 1 : 0);
        return edad >= 18;
    };
  return (
    <>
        <Header/>

        <div className="min-h-screen flex flex-col items-center justify-center ">
      <div className="bg-white shadow-2xl rounded-lg w-96 p-8">
        <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">
          Crear cuenta
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Apellido</label>
            <input
              type="text"
              name="Apellido"
              placeholder="Tu Apellido"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Fecha de nacimiento</label>
            <input
              type="date"
              name="fechaNacimiento"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>


          <div>
            <label className="block text-gray-700 text-sm mb-1">Correo electrónico</label>
            <input
              type="email"
              name="correo"
              placeholder="ejemplo@gmail.com"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Confirmar contraseña</label>
            <input
              type="password"
              name="confirmar"
              placeholder="********"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded transition"
          >
            Registrarse
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className=" w-full rounded p-2 mt-4 text-sm bg-gray-300 text-black-500 hover:text-gray-700 block mx-auto"
        >
          Volver al inicio
        </button>
      </div>
    </div>
    </>
  )
}
