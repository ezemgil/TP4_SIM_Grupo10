export async function ejecutarSimulacion(params) {
    const res = await fetch("http://localhost:8000/simulacion/ejecutar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  
    if (!res.ok) throw new Error("Error al ejecutar la simulación");
  
    return await res.json();
  }
  