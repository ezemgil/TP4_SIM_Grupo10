import { useState } from "react";

export default function SimuladorForm({ onSimular }) {
  const [params, setParams] = useState({
    tiempo_simulacion: 100,
    cantidad_iteraciones: 1000,
    mostrar_desde: 0,
    mostrar_cantidad: 10,
    tiempo_entre_llegadas: 4,
    prob_solicitud: 45,
    prob_entrega: 45,
    prob_consulta: 10,
    consulta_min: 2,
    consulta_max: 5,
    entrega_media: 2,
    entrega_rango: 0.5,
    solicitud_media: 6,
    actividad_media: 30,
    prob_se_va_tras_solicitud: 60,
    capacidad_maxima: 20
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams({ ...params, [name]: parseFloat(value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSimular(params);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Parámetros de Simulación</h2>
      {Object.keys(params).map((key) => (
        <div key={key}>
          <label>{key.replaceAll("_", " ")}:</label>
          <input
            type="number"
            step="0.1"
            name={key}
            value={params[key]}
            onChange={handleChange}
          />
        </div>
      ))}
      <button type="submit">Simular</button>
    </form>
  );
}