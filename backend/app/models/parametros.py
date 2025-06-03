from pydantic import BaseModel

class ParametrosSimulacion(BaseModel):
    tiempo_simulacion: int
    cantidad_iteraciones: int
    mostrar_desde: int
    mostrar_cantidad: int

    tiempo_entre_llegadas: float = 4
    prob_solicitud: float = 0.45
    prob_entrega: float = 0.45
    prob_consulta: float = 0.10

    tiempo_consulta_min: float = 2
    tiempo_consulta_max: float = 5
    tiempo_entrega_media: float = 2
    tiempo_entrega_rango: float = 0.5
    media_solicitud: float = 6
    media_actividad_secundaria: float = 30
    prob_se_retira: float = 0.6
    capacidad_maxima: int = 20