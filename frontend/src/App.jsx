import { useState } from "react";
import SimuladorForm from "./components/SimuladorForm";
import ResultadoTabla from "./components/ResultadoTabla";

export default function App() {
  const [resultado, setResultado] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Simulador Centro de Documentación
      </h1>

      <SimuladorForm onResultado={setResultado} />

      {resultado && <ResultadoTabla data={resultado} />}
    </div>
  );
}
