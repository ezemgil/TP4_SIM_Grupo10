import React, { useState } from 'react'
import axios from 'axios'
import TablaResultados from './TablaResultados'

const App = () => {
  const [parametros, setParametros] = useState({
    tiempo_maximo: 480,
    max_iteraciones: 1000,
    mostrar_desde_hora: 0,
    mostrar_cantidad_iteraciones: 10
  })

  const [resultados, setResultados] = useState([])
  const [cargando, setCargando] = useState(false)

  const handleChange = (e) => {
    setParametros({
      ...parametros,
      [e.target.name]: Number(e.target.value)
    })
  }

  const ejecutarSimulacion = async () => {
    setCargando(true)
    try {
      const res = await axios.post('http://127.0.0.1:8000/simular', parametros)
      setResultados(res.data.filas)
    } catch (error) {
      alert("Error al ejecutar simulación.")
      console.error(error)
    }
    setCargando(false)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Simulación - Centro de Documentación</h1>

      <div style={{ marginBottom: 20 }}>
        <label>Tiempo máximo:</label>
        <input type="number" name="tiempo_maximo" value={parametros.tiempo_maximo} onChange={handleChange} />
        <label> Iteraciones máximas:</label>
        <input type="number" name="max_iteraciones" value={parametros.max_iteraciones} onChange={handleChange} />
        <label> Desde hora:</label>
        <input type="number" name="mostrar_desde_hora" value={parametros.mostrar_desde_hora} onChange={handleChange} />
        <label> Cantidad a mostrar:</label>
        <input type="number" name="mostrar_cantidad_iteraciones" value={parametros.mostrar_cantidad_iteraciones} onChange={handleChange} />
        <button onClick={ejecutarSimulacion}>Simular</button>
      </div>

      {cargando ? <p>Cargando...</p> : <TablaResultados filas={resultados} />}
    </div>
  )
}

export default App
