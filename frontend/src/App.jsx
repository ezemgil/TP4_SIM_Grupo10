import { useState } from "react";
import SimuladorForm from "./components/SimuladorForm";
import VectorDeEstado from "./components/VectorDeEstado";
import { ejecutarSimulacion } from "./services/simulacionService";

function App() {
  const [resultado, setResultado] = useState(null);

  const manejarSimulacion = async (params) => {
    try {
      const res = await ejecutarSimulacion(params);
      setResultado(res);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div>
      <h1>Simulador - Centro de Documentación</h1>
      <SimuladorForm onSimular={manejarSimulacion} />
      {resultado && (
        <VectorDeEstado
          vector={resultado.vector_estado}
          estadisticas={resultado.estadisticas}
        />
      )}
    </div>
  );
}

export default App;