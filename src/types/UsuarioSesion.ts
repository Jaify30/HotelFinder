export interface UsuarioSesion {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  dni?: string;
  rol: string;
  idHotel?: number;  // ← Importante para login de hoteles
}