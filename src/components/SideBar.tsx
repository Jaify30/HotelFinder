import { faClipboardList, faHotel, faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SidebarProps {
  setSeccion: (seccion: string) => void;
}

export default function Sidebar({ setSeccion }: SidebarProps) {
  return (
    <aside className="w-64 h-screen bg-orange-500 text-white flex flex-col p-4 space-y-6">
      <h2 className="text-2xl font-bold text-center">Admin</h2>
      <nav className="flex flex-col gap-4">
        <button onClick={() => setSeccion("hoteles")} className="hover:bg-orange-600 p-2 rounded-md flex items-center gap-2">
          <FontAwesomeIcon icon={faHotel} /> Hoteles
        </button>
        <button onClick={() => setSeccion("usuarios")} className="hover:bg-orange-600 p-2 rounded-md flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} /> Usuarios
        </button>
        <button onClick={() => setSeccion("reservas")} className="hover:bg-orange-600 p-2 rounded-md flex items-center gap-2">
          <FontAwesomeIcon icon={faClipboardList} /> Reservas
        </button>
        <button onClick={() => setSeccion("valoraciones")} className="hover:bg-orange-600 p-2 rounded-md flex items-center gap-2">
          <FontAwesomeIcon icon={faStar} /> Valoraciones
        </button>
      </nav>
    </aside>
  );
}
