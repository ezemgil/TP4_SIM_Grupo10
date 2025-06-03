import heapq
import random
from app.models.evento import Evento, TipoEvento
from app.models.persona import Persona, TipoTramite, EstadoPersona
from app.models.empleado import Empleado


class Simulador:
    def __init__(self, config):
        self.config = config
        self.tiempo_max = config.tiempo_simulacion
        self.iteraciones_max = config.cantidad_iteraciones
        self.mostrar_desde = config.mostrar_desde
        self.mostrar_cantidad = config.mostrar_cantidad

        self.eventos_futuros = []
        self.reloj = 0
        self.iteracion = 0
        self.vector_estado = []

        self.cola = []
        self.personas = {}
        self.empleados = [Empleado(1), Empleado(2)]
        self.proximo_id = 1

        self.acumulador_permanencia = 0.0
        self.contador_personas_que_ingresaron = 0
        self.contador_rechazados_por_capacidad = 0

        self.programar_evento(
            TipoEvento.LLEGADA, self.reloj + self.config.tiempo_entre_llegadas
        )

    def programar_evento(self, tipo, tiempo, persona_id=None):
        evento = Evento(tipo, tiempo, persona_id)
        heapq.heappush(self.eventos_futuros, evento)

    def simular(self):
        while (
            self.eventos_futuros
            and self.reloj < self.tiempo_max
            and self.iteracion < self.iteraciones_max
        ):
            evento = heapq.heappop(self.eventos_futuros)
            self.reloj = evento.tiempo
            self.procesar_evento(evento)
            self.registrar_estado(evento)
            self.iteracion += 1

        inicio = self.mostrar_desde
        fin = inicio + self.mostrar_cantidad
        promedio = 0
        if self.contador_personas_que_ingresaron > 0:
            promedio = (
                self.acumulador_permanencia / self.contador_personas_que_ingresaron
            )

        porcentaje_rechazo = 0
        total_llegadas = (
            self.contador_personas_que_ingresaron
            + self.contador_rechazados_por_capacidad
        )
        if total_llegadas > 0:
            porcentaje_rechazo = (
                self.contador_rechazados_por_capacidad / total_llegadas
            ) * 100

        return {
            "vector_estado": self.vector_estado[inicio:fin],
            "ultima_fila": self.vector_estado[-1] if self.vector_estado else None,
            "estadisticas": {
                "promedio_permanencia": round(promedio, 2),
                "rechazo_por_capacidad": round(porcentaje_rechazo, 2),
            },
        }

    def procesar_evento(self, evento):
        if evento.tipo == TipoEvento.LLEGADA:
            persona = Persona(self.proximo_id, self.reloj)
            self.personas[self.proximo_id] = persona
            self.proximo_id += 1

            if self.puede_entrar_al_sistema():
                self.contador_personas_que_ingresaron += 1
                self.cola.append(persona)
                self.intentar_atender()
            else:
                self.contador_rechazados_por_capacidad += 1

            self.programar_evento(TipoEvento.LLEGADA, self.reloj + 4)

        elif (
            evento.tipo == TipoEvento.FIN_CONSULTA
            or evento.tipo == TipoEvento.FIN_ENTREGA
        ):
            self.finalizar_atencion(evento.persona_id)
            self.intentar_atender()

        elif evento.tipo == TipoEvento.FIN_SOLICITUD:
            self.finalizar_atencion(evento.persona_id)
            r = random.random()
            persona = self.personas[evento.persona_id]

            if r < self.config.prob_se_va_tras_solicitud / 100:
                persona.estado = EstadoPersona.DESTRUIDO
                self.acumulador_permanencia += self.reloj - persona.hora_llegada
            else:
                persona.estado = EstadoPersona.REALIZANDO_ACTIVIDAD_SECUNDARIA
                duracion = random.expovariate(1 / self.config.actividad_media)
                self.programar_evento(
                    TipoEvento.FIN_ACTIVIDAD_SECUNDARIA,
                    self.reloj + duracion,
                    persona.id,
                )

            self.intentar_atender()

        elif evento.tipo == TipoEvento.FIN_ACTIVIDAD_SECUNDARIA:
            persona = self.personas[evento.persona_id]
            persona.estado = EstadoPersona.EN_COLA
            self.cola.append(persona)
            self.intentar_atender()

    def puede_entrar_al_sistema(self):
        return (
            len(
                [
                    p
                    for p in self.personas.values()
                    if p.estado != EstadoPersona.DESTRUIDO
                ]
            )
            < self.config.capacidad_maxima
        )

    def intentar_atender(self):
        for emp in self.empleados:
            if emp.libre and self.cola:
                persona = self.cola.pop(0)
                emp.libre = False
                emp.persona_atendiendo = persona.id

                # Asignar el estado correcto según el trámite
                if persona.tramite == TipoTramite.SOLICITUD:
                    persona.estado = EstadoPersona.SOLICITANDO_DOCUMENTOS
                elif persona.tramite == TipoTramite.ENTREGA:
                    persona.estado = EstadoPersona.ENTREGANDO_DOCUMENTOS
                elif persona.tramite == TipoTramite.CONSULTA:
                    persona.estado = EstadoPersona.CONSULTANDO_REQUISITOS

                duracion = self.obtener_duracion(persona)
                self.programar_evento(
                    self.tipo_evento_fin(persona), self.reloj + duracion, persona.id
                )

    def tipo_evento_fin(self, persona):
        if persona.tramite == TipoTramite.CONSULTA:
            return TipoEvento.FIN_CONSULTA
        elif persona.tramite == TipoTramite.ENTREGA:
            return TipoEvento.FIN_ENTREGA
        else:
            return TipoEvento.FIN_SOLICITUD

    def obtener_duracion(self, persona):
        if persona.tramite == TipoTramite.CONSULTA:
            return random.uniform(self.config.consulta_min, self.config.consulta_max)
        elif persona.tramite == TipoTramite.ENTREGA:
            return (
                self.config.entrega_media
                + (random.random() - 0.5) * 2 * self.config.entrega_rango
            )
        else:
            return random.expovariate(1 / self.config.solicitud_media)

    def finalizar_atencion(self, persona_id):
        persona = self.personas[persona_id]

        # Si se va directamente
        if persona.estado in [
            EstadoPersona.SOLICITANDO_DOCUMENTOS,
            EstadoPersona.ENTREGANDO_DOCUMENTOS,
            EstadoPersona.CONSULTANDO_REQUISITOS,
        ]:
            persona.estado = EstadoPersona.DESTRUIDO
            permanencia = self.reloj - persona.hora_llegada
            self.acumulador_permanencia += permanencia

        for emp in self.empleados:
            if emp.persona_atendiendo == persona_id:
                emp.libre = True
                emp.persona_atendiendo = None

    def registrar_estado(self, evento):
        estado = {
            "iteracion": self.iteracion,
            "hora_simulada": self.reloj,
            "evento": evento.tipo.value,
            "eventos_futuros": [(e.tipo.value, e.tiempo) for e in self.eventos_futuros],
            "cola": [p.id for p in self.cola],
            "empleados": [
                {"id": e.id, "libre": e.libre, "atendiendo": e.persona_atendiendo}
                for e in self.empleados
            ],
        }
        self.vector_estado.append(estado)
