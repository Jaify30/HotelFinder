import Swal from "sweetalert2";
import { appsettings } from "../settings/appsettings";

export const Eliminar = (endpoint: string, id: number, onSuccess?: () => void) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará el registro (o lo marcará como inactivo).",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${appsettings.apiUrl}${endpoint}/Eliminar/${id}`, { method: "DELETE" })
        .then((res) => {
          if (!res.ok) throw new Error("Error al eliminar");
          Swal.fire("Eliminado", "El registro fue actualizado correctamente.", "success");
          if (onSuccess) onSuccess(); // 👈 actualiza el estado local
        })
        .catch(() => {
          Swal.fire("Error", "No se pudo eliminar el registro.", "error");
        });
    }
  });
};
