import { useState } from "react";
import axios from "axios";

export default function SimuladorForm({ onResultado }) {
  const [form, setForm] = useState({
    tiempo_simulacion: 1000,
    cantidad_iteraciones: 50,
    mostrar_desde: 1,
    mostrar_cantidad: 20,
    tiempo_entre_llegadas: 3,
    prob_solicitud: 45,
    prob_entrega: 45,
    prob_consulta: 10,
    consulta_min: 4,
    consulta_max: 6,
    entrega_media: 5,
    entrega_rango: 1.5,
    solicitud_media: 10,
    actividad_media: 8,
    prob_se_va_tras_solicitud: 30,
    capacidad_maxima: 100,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: parseFloat(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:8000/simulacion/ejecutar", form);
    onResultado(response.data);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 p-4">
      {Object.entries(form).map(([key, value]) => (
        <div key={key}>
          <label className="block text-sm font-medium">{key}</label>
          <input
            type="number"
            step="any"
            name={key}
            value={value}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1"
          />
        </div>
      ))}
      <button
        type="submit"
        className="col-span-2 bg-blue-600 text-white p-2 rounded mt-2"
      >
        Ejecutar Simulación
      </button>
    </form>
  );
}
