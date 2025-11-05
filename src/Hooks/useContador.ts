// 📁 Hooks/useContador.ts
import { useState, useEffect, useCallback } from "react";
import { appsettings } from "../settings/appsettings";

export function useContadores() {
  const [usuarios, setUsuarios] = useState(0);
  const [reseñas, setReseñas] = useState(0);
  const [hoteles, setHoteles] = useState(0);
  const [reservas, setReservas] = useState(0);
  const [promedioEstrellas, setPromedioEstrellas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [usuariosRes, reseñasRes, hotelesRes, reservasRes] = await Promise.all([
        fetch(`${appsettings.apiUrl}Usuario/Lista`).then((r) => r.json()),
        fetch(`${appsettings.apiUrl}Resenias/Lista`).then((r) => r.json()),
        fetch(`${appsettings.apiUrl}Hotele/Lista`).then((r) => r.json()),
        fetch(`${appsettings.apiUrl}Reserva/Lista`).then((r) => r.json()),
      ]);

      setUsuarios(usuariosRes.length);
      setReseñas(reseñasRes.length);
      setHoteles(hotelesRes.length);
      setReservas(reservasRes.length);

      const totalEstrellas = hotelesRes.reduce(
        (acc: number, h: any) => acc + (h.estrellas || 0),
        0
      );

      setPromedioEstrellas(
        hotelesRes.length ? parseFloat((totalEstrellas / hotelesRes.length).toFixed(1)) : 0
      );


      setError(null);
    } catch (err) {
      setError("Error al cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    usuarios,
    reseñas,
    hoteles,
    reservas,
    promedioEstrellas,
    loading,
    error,
    refetch: fetchData, // 👈 exportamos refetch para usarlo desde fuera
  };
}
