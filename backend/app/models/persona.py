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
        self.estado = EstadoPersona.EN_COLA
        self.rnd_tramite = random.random()
        if self.rnd_tramite < config.prob_solicitud / 100:
            self.tramite = TipoTramite.SOLICITUD
        elif self.rnd_tramite < (config.prob_solicitud + config.prob_entrega) / 100:
            self.tramite = TipoTramite.ENTREGA
        else:
            self.tramite = TipoTramite.CONSULTA

        # Resto de atributos...
        self.reinsercion = None
        self.centro_cerrado = None
        self.hora_salida = None
        self.tiempo_permanencia = 0