# simulador.py
import random
from constantes import *
from modelos import FilaEstado
from typing import List, Dict
import json

def generar_tramite() -> str:
    r = random.random()
    if r < PROBABILIDADES_TRAMITE["solicitud"]:
        return "solicitud"
    elif r < PROBABILIDADES_TRAMITE["solicitud"] + PROBABILIDADES_TRAMITE["entrega"]:
        return "entrega"
    return "consulta"

def generar_duracion(tramite: str) -> float:
    dist = DISTRIBUCIONES[tramite]
    if dist["tipo"] == "uniforme":
        return random.uniform(dist["a"], dist["b"])
    elif dist["tipo"] == "exponencial":
        return random.expovariate(1 / dist["media"])
    return 0

def simular(tiempo_maximo: int, max_iteraciones: int) -> List[FilaEstado]:
    estado = []
    hora_actual = 0
    iteracion = 0
    llegada_proxima = 0
    personas_dentro = 0
    evento = "Inicio"
    empleado_1 = {"estado": "libre", "tramite": None}
    empleado_2 = {"estado": "libre", "tramite": None}

    while hora_actual <= tiempo_maximo and iteracion < max_iteraciones:
        evento = "Llegada" if hora_actual >= llegada_proxima else "Espera"
        if evento == "Llegada":
            if personas_dentro < CAPACIDAD_CENTRO:
                personas_dentro += 1
                tramite = generar_tramite()
                duracion = generar_duracion(tramite)
                # Simple ejemplo: asignar directamente a primer empleado libre
                if empleado_1["estado"] == "libre":
                    empleado_1 = {"estado": "ocupado", "tramite": tramite}
                elif empleado_2["estado"] == "libre":
                    empleado_2 = {"estado": "ocupado", "tramite": tramite}
                # si no hay empleados libres, la persona espera (no modelado aquí aún)
            llegada_proxima += TIEMPO_LLEGADA
        fila = FilaEstado(
            hora=hora_actual,
            evento=evento,
            proximo_evento={
                "llegada": llegada_proxima,
                "fin_atencion_1": None,
                "fin_atencion_2": None
            },
            personas_dentro=personas_dentro,
            empleado_1=empleado_1,
            empleado_2=empleado_2
        )
        estado.append(fila)
        hora_actual += 1
        iteracion += 1

    # Guardamos estado en archivo temporal
    with open("estado_actual.json", "w") as f:
        json.dump([f.dict() for f in estado], f, indent=2)

    return estado
