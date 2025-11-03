interface Props {
  titulo: string;
  valor: number | string;
  icono: React.ReactNode;
}

export default function CardEstadistica({ titulo, valor, icono }: Props) {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
      <div>
        <h3 className="text-gray-500 text-sm">{titulo}</h3>
        <p className="text-2xl font-bold text-gray-800">{valor}</p>
      </div>
      <div className="text-orange-500 text-3xl">{icono}</div>
    </div>
  );
}