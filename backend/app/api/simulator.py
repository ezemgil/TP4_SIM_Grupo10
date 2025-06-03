from fastapi import APIRouter
from pydantic import BaseModel
from app.services.simulador import Simulador

router = APIRouter()

class ParametrosSimulacion(BaseModel):
    # Parámetros de ejecución
    tiempo_simulacion: int
    cantidad_iteraciones: int
    mostrar_desde: int
    mostrar_cantidad: int

    # Parámetros del sistema (resaltados en rojo)
    tiempo_entre_llegadas: float
    prob_solicitud: float
    prob_entrega: float
    prob_consulta: float
    consulta_min: float
    consulta_max: float
    entrega_media: float
    entrega_rango: float
    solicitud_media: float
    actividad_media: float
    prob_se_va_tras_solicitud: float
    capacidad_maxima: int

@router.post("/ejecutar")
def ejecutar_simulacion(params: ParametrosSimulacion):
    sim = Simulador(params)
    return sim.simular()
