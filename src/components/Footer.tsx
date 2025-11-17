
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10">

        {/* LOGO + DESCRIPCIÓN */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">HotelFinder</h2>
          <p className="text-gray-400">
            La mejor plataforma para descubrir, comparar y reservar hoteles en todo el mundo.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Navegación</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-white transition">Inicio</a></li>
            <li><a href="/hoteles" className="hover:text-white transition">Hoteles</a></li>
            <li><a href="/sobre-nosotros" className="hover:text-white transition">Sobre nosotros</a></li>
          </ul>
        </div>

        {/* CONTACTO */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contacto</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Email: soporte@hotelfinder.com</li>
            <li>Tel: +54 11 5555-5555</li>
            <li>Buenos Aires, Argentina</li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-5">
        © {new Date().getFullYear()} HotelFinder — Todos los derechos reservados.
      </div>
    </footer>
  );
}
