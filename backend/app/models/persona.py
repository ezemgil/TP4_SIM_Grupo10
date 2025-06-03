from enum import Enum
import random

class TipoTramite(str, Enum):
    SOLICITUD = "Solicitud"
    ENTREGA = "Entrega"
    CONSULTA = "Consulta"

class EstadoPersona(str, Enum):
    EN_COLA = "EC"
    SOLICITANDO_DOCUMENTOS = "SD"
    ENTREGANDO_DOCUMENTOS = "ED"
    CONSULTANDO_REQUISITOS = "CR"
    REALIZANDO_ACTIVIDAD_SECUNDARIA = "RAS"
    DESTRUIDO = "D"

class Persona:
    def __init__(self, id, hora_llegada, config):
        self.id = id
        self.hora_llegada = hora_llegada
        self.tramite = self.definir_tramite(config)
        self.estado = EstadoPersona.EN_COLA
        self.hora_inicio_atencion = None
        self.hora_fin_atencion = None

    def definir_tramite(self, config):
        r = random.random()
        if r < config.prob_solicitud / 100:
            return TipoTramite.SOLICITUD
        elif r < (config.prob_solicitud + config.prob_entrega) / 100:
            return TipoTramite.ENTREGA
        else:
            return TipoTramite.CONSULTA
