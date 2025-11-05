// src/hooks/useVerHotel.ts
import { useNavigate } from "react-router-dom";

export function useVerHotel() {
  const navigate = useNavigate();

  const verHotel = (id: number) => {
    navigate(`/hotel/${id}`);
  };

  return verHotel;
}
