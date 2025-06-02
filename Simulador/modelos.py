# modelos.py
from pydantic import BaseModel
from typing import Optional, List, Dict

class ParametrosSimulacion(BaseModel):
    tiempo_maximo: int = 480
    max_iteraciones: int = 10000
    mostrar_desde_hora: int = 0
    mostrar_cantidad_iteraciones: int = 100

class FilaEstado(BaseModel):
    hora: float
    evento: str
    proximo_evento: Dict[str, Optional[float]]
    personas_dentro: int
    empleado_1: Dict[str, Optional[str]]
    empleado_2: Dict[str, Optional[str]]

class ResultadoSimulacion(BaseModel):
    mensaje: str
    iteraciones_realizadas: int
    duracion_simulada: float
    filas: List[FilaEstado]
