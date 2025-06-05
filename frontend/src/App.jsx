import { useState } from "react";
import SimuladorForm from "./components/SimuladorForm";
import VectorDeEstado from "./components/VectorDeEstado";
import { ejecutarSimulacion } from "./services/simulacionService";

function App() {
  const [resultado, setResultado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const manejarSimulacion = async (params) => {
    try {
      setIsLoading(true);
      const res = await ejecutarSimulacion(params);
      setResultado(
        {
        vector: res.vector_estado, 
        estadisticas: res.estadisticas,
        });
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Sistema de Simulación de Procesos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Configure los parámetros de simulación, ejecute el análisis y visualice los resultados detallados
          </p>
        </div>

        <SimuladorForm onSimular={manejarSimulacion} isLoading={isLoading} />

        {resultado && (
          <VectorDeEstado 
            vector={resultado.vector} 
            estadisticas={resultado.estadisticas} 
          />
        )}
      </div>
    </div>
  )
}

export default App