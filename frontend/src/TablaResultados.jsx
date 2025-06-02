import React from 'react'

const TablaResultados = ({ filas }) => {
  if (!filas || filas.length === 0) return null

  return (
    <table border="1" cellPadding="5">
      <thead>
  <tr>
    <th>Hora</th>
    <th>Evento</th>
    <th>RND</th>
    <th>Tipo Trámite</th>
    <th>Tiempo Atención</th>
    <th>Fin Atención 1</th>
    <th>Fin Atención 2</th>
    <th>Empleado 1</th>
    <th>Empleado 2</th>
    <th>Cola</th>
    <th>Personas Dentro</th>
    <th>Auxiliares</th>
  </tr>
</thead>
<tbody>
  {filas.map((fila, i) => (
    <tr key={i}>
      <td>{fila.hora.toFixed(2)}</td>
      <td>{fila.evento}</td>
      <td>{fila.rnd_tipo_tramite?.toFixed(4)}</td>
      <td>{fila.tipo_tramite}</td>
      <td>{fila.tiempo_atencion?.toFixed(2)}</td>
      <td>{fila.fin_atencion_1?.toFixed(2) ?? '-'}</td>
      <td>{fila.fin_atencion_2?.toFixed(2) ?? '-'}</td>
      <td>{fila.estado_empleado_1} - {fila.tramite_empleado_1 ?? '-'}</td>
      <td>{fila.estado_empleado_2} - {fila.tramite_empleado_2 ?? '-'}</td>
      <td>{fila.cola_espera.join(', ')}</td>
      <td>{fila.personas_dentro}</td>
      <td>
        {Object.entries(fila.variables_auxiliares || {}).map(
          ([key, val]) => <div key={key}>{key}: {val}</div>
        )}
      </td>
    </tr>
  ))}
</tbody>
    </table>
  )
}

export default TablaResultados
