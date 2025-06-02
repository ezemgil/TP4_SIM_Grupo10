import React from 'react'

const TablaResultados = ({ filas }) => {
  if (!filas || filas.length === 0) return null

  return (
    <table border="1" cellPadding="5">
      <thead>
        <tr>
          <th>Hora</th>
          <th>Evento</th>
          <th>Próxima Llegada</th>
          <th>Personas Dentro</th>
          <th>Empleado 1</th>
          <th>Empleado 2</th>
        </tr>
      </thead>
      <tbody>
        {filas.map((fila, i) => (
          <tr key={i}>
            <td>{fila.hora.toFixed(2)}</td>
            <td>{fila.evento}</td>
            <td>{fila.proximo_evento?.llegada?.toFixed(2) ?? '-'}</td>
            <td>{fila.personas_dentro}</td>
            <td>{fila.empleado_1.tramite ? `${fila.empleado_1.estado} - ${fila.empleado_1.tramite}` : fila.empleado_1.estado}</td>
            <td>{fila.empleado_2.tramite ? `${fila.empleado_2.estado} - ${fila.empleado_2.tramite}` : fila.empleado_2.estado}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TablaResultados
