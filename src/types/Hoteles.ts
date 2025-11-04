export interface Hotel {
  id: number;
  nombre: string;
  descripcion: string;
  direccion: string;
  pais: string;
  ciudad: string;
  telefono: string;
  estrellas: number;
  imagenUrl?: string;
}
