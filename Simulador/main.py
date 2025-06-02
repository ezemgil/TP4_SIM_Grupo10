# main.py
from fastapi import FastAPI, Query
from modelos import ParametrosSimulacion, ResultadoSimulacion, FilaEstado
from simulador import simular
from typing import List

import json

app = FastAPI()

@app.get("/")
def home():
    return {"mensaje": "La API está funcionando. Usá /docs para probarla."}


@app.post("/simular", response_model=ResultadoSimulacion)
def ejecutar_simulacion(param: ParametrosSimulacion):
    estado = simular(param.tiempo_maximo, param.max_iteraciones)
    resultado = estado[param.mostrar_desde_hora:param.mostrar_desde_hora + param.mostrar_cantidad_iteraciones]
    return ResultadoSimulacion(
        mensaje="Simulación completada",
        iteraciones_realizadas=len(estado),
        duracion_simulada=estado[-1].hora if estado else 0,
        filas=resultado
    )

@app.get("/estado", response_model=List[FilaEstado])
def obtener_estado(desde: int = Query(0), cantidad: int = Query(100)):
    with open("estado_actual.json", "r") as f:
        datos = json.load(f)
    return datos[desde:desde + cantidad]

@app.get("/estado/ultima", response_model=FilaEstado)
def ultima_fila():
    with open("estado_actual.json", "r") as f:
        datos = json.load(f)
    return datos[-1]
