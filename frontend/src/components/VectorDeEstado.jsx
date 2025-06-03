export default function VectorDeEstado({ vector, estadisticas }) {
  const maxClientes = 10; // Podés ajustar este valor

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[2400px] border border-gray-600 text-sm text-white">
        <thead className="bg-gray-800 sticky top-0 z-10">
          <tr>
            <th className="border px-2 py-1">Evento</th>
            <th className="border px-2 py-1">Reloj</th>

            <th className="border px-2 py-1">Llegada Cliente - Valor</th>
            <th className="border px-2 py-1">
              Llegada Cliente - Próxima Llegada
            </th>

            <th className="border px-2 py-1">Trámite - RND</th>
            <th className="border px-2 py-1">Trámite - Tipo</th>

            {/* Empleado 1 */}
            <th className="border px-2 py-1">Emp1 - Estado</th>
            <th className="border px-2 py-1">Emp1 - RND</th>
            <th className="border px-2 py-1">Emp1 - Duración</th>
            <th className="border px-2 py-1">Emp1 - Fin Atención</th>

            {/* Empleado 2 */}
            <th className="border px-2 py-1">Emp2 - Estado</th>
            <th className="border px-2 py-1">Emp2 - RND</th>
            <th className="border px-2 py-1">Emp2 - Duración</th>
            <th className="border px-2 py-1">Emp2 - Fin Atención</th>

            {/* Actividades Secundarias */}
            <th className="border px-2 py-1">RAS - RND</th>
            <th className="border px-2 py-1">RAS - ¿Se queda?</th>
            <th className="border px-2 py-1">RAS - RND Valor</th>
            <th className="border px-2 py-1">RAS - Valor</th>
            <th className="border px-2 py-1">RAS - Reinserción</th>

            {/* Estado sistema */}
            <th className="border px-2 py-1">Cola</th>
            <th className="border px-2 py-1">Personas Local</th>
            <th className="border px-2 py-1">Acum. Atendidos</th>
            <th className="border px-2 py-1">Acum. Permanencia</th>
            <th className="border px-2 py-1">Acum. No Ingresa</th>

            {/* Clientes */}
            {Array.from({ length: maxClientes }, (_, i) => (
              <>
                <th key={`c${i}-id`} className="border px-2 py-1">
                  Cliente {i + 1} - ID
                </th>
                <th key={`c${i}-hora`} className="border px-2 py-1">
                  Hora Llegada
                </th>
                <th key={`c${i}-estado`} className="border px-2 py-1">
                  Estado
                </th>
                <th key={`c${i}-reins`} className="border px-2 py-1">
                  Reinserción
                </th>
                <th key={`c${i}-cerrado`} className="border px-2 py-1">
                  Centro Cerrado
                </th>
                <th key={`c${i}-perm`} className="border px-2 py-1">
                  T. Permanencia
                </th>
              </>
            ))}
          </tr>
        </thead>
        <tbody>
          {vector.map((fila, idx) => (
            <tr key={idx} className="bg-gray-900">
              <td className="border px-2 py-1">{fila.evento}</td>
              <td className="border px-2 py-1">{fila.reloj}</td>

              <td className="border px-2 py-1">{fila.llegada_valor ?? "-"}</td>
              <td className="border px-2 py-1">
                {fila.proxima_llegada ?? "-"}
              </td>

              <td className="border px-2 py-1">{fila.rnd_tramite ?? "-"}</td>
              <td className="border px-2 py-1">{fila.tipo_tramite ?? "-"}</td>

              {/* Emp1 */}
              <td className="border px-2 py-1">
                {fila.empleado_1?.libre
                  ? "Libre"
                  : `Ocupado (${fila.empleado_1.atendiendo})`}
              </td>
              <td className="border px-2 py-1">
                {fila.empleado_1?.rnd ?? "-"}
              </td>
              <td className="border px-2 py-1">
                {fila.empleado_1?.duracion ?? "-"}
              </td>
              <td className="border px-2 py-1">
                {fila.empleado_1?.fin_atencion ?? "-"}
              </td>

              {/* Emp2 */}
              <td className="border px-2 py-1">
                {fila.empleado_2?.libre
                  ? "Libre"
                  : `Ocupado (${fila.empleado_2.atendiendo})`}
              </td>
              <td className="border px-2 py-1">
                {fila.empleado_2?.rnd ?? "-"}
              </td>
              <td className="border px-2 py-1">
                {fila.empleado_2?.duracion ?? "-"}
              </td>
              <td className="border px-2 py-1">
                {fila.empleado_2?.fin_atencion ?? "-"}
              </td>

              {/* RAS */}
              <td className="border px-2 py-1">{fila.rnd_ras ?? "-"}</td>
              <td className="border px-2 py-1">{fila.se_queda_ras ?? "-"}</td>
              <td className="border px-2 py-1">{fila.rnd_valor_ras ?? "-"}</td>
              <td className="border px-2 py-1">{fila.valor_ras ?? "-"}</td>
              <td className="border px-2 py-1">{fila.reinsercion ?? "-"}</td>

              {/* Estado sistema */}
              <td className="border px-2 py-1">{fila.cola}</td>
              <td className="border px-2 py-1">{fila.personas_local}</td>
              <td className="border px-2 py-1">{fila.acum_atendidos}</td>
              <td className="border px-2 py-1">{fila.acum_permanencia}</td>
              <td className="border px-2 py-1">{fila.acum_no_ingresa}</td>

              {/* Clientes */}
              {Array.from({ length: maxClientes }).map((_, i) => {
                const c = fila.clientes?.[i];
                return (
                  <>
                    <td className="border px-2 py-1">{c?.id ?? "-"}</td>
                    <td className="border px-2 py-1">
                      {c?.hora_llegada ?? "-"}
                    </td>
                    <td className="border px-2 py-1">{c?.estado ?? "-"}</td>
                    <td className="border px-2 py-1">
                      {c?.reinsercion ?? "-"}
                    </td>
                    <td className="border px-2 py-1">
                      {c?.centro_cerrado ?? "-"}
                    </td>
                    <td className="border px-2 py-1">
                      {c?.permanencia ?? "-"}
                    </td>
                  </>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-white mt-6">
        <h3 className="text-lg font-bold">Estadísticas Finales</h3>
        <p>Promedio de permanencia: {estadisticas.promedio_permanencia}</p>
        <p>% Rechazo por capacidad: {estadisticas.rechazo_por_capacidad}</p>
      </div>
    </div>
  );
}
