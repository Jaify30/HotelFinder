type Reservas={
    id: number;
    idCliente: number;
    idHotel: number;
    idHabitacion: number;
    fechaEntrada:Date;
    fechaSalida:Date;
    cantidadHuespedes:number;
    estado:string;
}
export type { Reservas };