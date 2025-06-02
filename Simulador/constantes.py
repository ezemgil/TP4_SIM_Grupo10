# constantes.py

TIEMPO_LLEGADA = 4  # cada 4 minutos llega una persona
DISTRIBUCIONES = {
    "consulta": {"tipo": "uniforme", "a": 2, "b": 5},
    "entrega": {"tipo": "uniforme", "a": 1.5, "b": 2.5},
    "solicitud": {"tipo": "exponencial", "media": 6},
    "espera_adicional": {"tipo": "exponencial", "media": 30}
}
PROBABILIDADES_TRAMITE = {
    "solicitud": 0.45,
    "entrega": 0.45,
    "consulta": 0.10
}
CAPACIDAD_CENTRO = 20
