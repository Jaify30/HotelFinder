import { faClipboardList, faHotel, faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-orange-500 text-white flex flex-col p-4 space-y-6">
      <h2 className="text-2xl font-bold text-center">Admin</h2>
      <nav className="flex flex-col gap-4">
        <a href="#" className="hover:bg-orange-600 p-2 rounded-md flex items-center gap-2">
          <FontAwesomeIcon icon={faHotel} /> Hoteles
        </a>
        <a href="#" className="hover:bg-orange-600 p-2 rounded-md flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} /> Usuarios
        </a>
        <a href="#" className="hover:bg-orange-600 p-2 rounded-md flex items-center gap-2">
          <FontAwesomeIcon icon={faClipboardList} /> Reservas
        </a>
        <a href="#" className="hover:bg-orange-600 p-2 rounded-md flex items-center gap-2">
          <FontAwesomeIcon icon={faStar} /> Valoraciones
        </a>
      </nav>
    </aside>
  );
}
