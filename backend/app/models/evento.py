from enum import Enum

class TipoEvento(str, Enum):
    LLEGADA = "Llegada"
    FIN_CONSULTA = "FinConsulta"
    FIN_ENTREGA = "FinEntrega"
    FIN_SOLICITUD = "FinSolicitud"
    FIN_ACTIVIDAD_SECUNDARIA = "FinActividadSecundaria"

class Evento:
    def __init__(self, tipo, tiempo, persona_id=None):
        self.tipo = tipo
        self.tiempo = tiempo
        self.persona_id = persona_id

    def __lt__(self, other):
        return self.tiempo < other.tiempo