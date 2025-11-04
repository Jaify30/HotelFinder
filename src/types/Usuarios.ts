export type Usuario ={
  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date; // formato ISO: "2025-10-26"
  correo: string;
  contraseña: string; // si la recibís del backend; normalmente no se incluye por seguridad
  telefono: string;
  genero: string;
  nacionalidad: string;
  dniPasaporte: string;
  estado: boolean ;
}
