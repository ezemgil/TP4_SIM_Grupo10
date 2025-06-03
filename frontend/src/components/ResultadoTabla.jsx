export default function ResultadoTabla({ data }) {
  const vector = data.vector_estado || [];
  const estadisticas = data.estadisticas || {};

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-2">Vector de Estado</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th>Iteración</th>
              <th>Hora</th>
              <th>Evento</th>
              <th>Cola</th>
              <th>Empleados</th>
              <th>Eventos Futuros</th>
            </tr>
          </thead>
          <tbody>
            {vector.map((fila, i) => (
              <tr key={i} className="border-t border-gray-300">
                <td>{fila.iteracion}</td>
                <td>{fila.hora_simulada.toFixed(2)}</td>
                <td>{fila.evento}</td>
                <td>{fila.cola.join(", ")}</td>
                <td>
                  {fila.empleados
                    .map((e) =>
                      e.libre ? `E${e.id}:Libre` : `E${e.id}->${e.atendiendo}`
                    )
                    .join(" | ")}
                </td>
                <td>
                  {fila.eventos_futuros
                    .map(([tipo, tiempo]) => `${tipo}@${tiempo.toFixed(2)}`)
                    .join(" | ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Estadísticas Finales</h3>
        <ul className="mt-2 list-disc ml-6">
          <li>
            Promedio de permanencia: {estadisticas.promedio_permanencia} minutos
          </li>
          <li>Rechazo por capacidad: {estadisticas.rechazo_por_capacidad}%</li>
        </ul>
      </div>
    </div>
  );
}
