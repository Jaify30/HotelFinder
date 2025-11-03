type Reservas={
    ID: number;
    ID_Cliente: number;
    ID_Hotel: number;
    ID_Habitacion: number;
    FechaEntrada:Date;
    FechaSalida:Date;
    CantidadHuespedes:number;
    Estado:string;
}
export type { Reservas };