import Header from "../components/Header";

export default function SobreNosotros() {
  return (
    <>
      <Header />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
          Sobre Nosotros
        </h1>

        <p className="text-gray-600 text-center text-lg max-w-3xl mx-auto mb-10">
          Somos una plataforma dedicada a conectar viajeros con los mejores hoteles,
          ofreciendo una experiencia simple, rápida y segura. Nuestro objetivo es
          mejorar cada paso de tu viaje, desde la búsqueda hasta la reserva.
        </p>

        {/* Imagen principal */}
        <div className="flex justify-center mb-10">
          <img
            src="SobreNosotros.png"
            alt="Nuestro equipo"
            className="rounded-xl h-120 shadow-lg w-full max-w-3xl object-cover object-top"
          />
        </div>

        {/* Secciones */}
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Nuestra misión</h3>
            <p className="text-gray-600">
              Facilitar el acceso a alojamientos de calidad, con información clara
              y herramientas modernas para una búsqueda eficiente.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Nuestro equipo</h3>
            <p className="text-gray-600">
              Contamos con profesionales apasionados por la tecnología y el turismo,
              comprometidos con brindar la mejor experiencia al usuario.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Nuestra visión</h3>
            <p className="text-gray-600">
              Convertirnos en la plataforma de reservas más confiable de la región,
              con un ecosistema completo para hoteles y viajeros.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}