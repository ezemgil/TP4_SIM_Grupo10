# modelos.py
from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class ParametrosSimulacion(BaseModel):
    tiempo_maximo: int = 480
    max_iteraciones: int = 10000
    mostrar_desde_hora: int = 0
    mostrar_cantidad_iteraciones: int = 100

class FilaEstado(BaseModel):
    hora: float
    evento: str
    rnd_tipo_tramite: Optional[float]
    tipo_tramite: Optional[str]
    tiempo_atencion: Optional[float]
    fin_atencion_1: Optional[float]
    fin_atencion_2: Optional[float]
    estado_empleado_1: str
    estado_empleado_2: str
    tramite_empleado_1: Optional[str]
    tramite_empleado_2: Optional[str]
    cola_espera: int
    personas_dentro: int
    variables_auxiliares: Dict[str, Any]

class ResultadoSimulacion(BaseModel):
    mensaje: str
    iteraciones_realizadas: int
    duracion_simulada: float
    filas: List[FilaEstado]
