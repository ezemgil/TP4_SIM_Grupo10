import heapq
import random
import math
from app.models.evento import Evento, TipoEvento
from app.models.persona import Persona, TipoTramite, EstadoPersona
from app.models.empleado import Empleado

class Simulador:
    def __init__(self, config):
        self.config = config
        self.tiempo_max = config.tiempo_simulacion
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

        self.ultima_llegada_valor = None
        self.ultima_proxima_llegada = None
        self.ultima_rnd_tramite = None
        self.ultimo_tipo_tramite = None
        self.rnd_actividad_secundaria = None
        self.se_queda_ras = None
        self.rnd_valor_ras = None
        self.valor_ras = None
        self.reinsercion_actual = None

        self.programar_evento(TipoEvento.LLEGADA, self.reloj)

    def programar_evento(self, tipo, tiempo, persona_id=None):
        evento = Evento(tipo, tiempo, persona_id)
        heapq.heappush(self.eventos_futuros, evento)

    def simular(self):
        while self.eventos_futuros and self.reloj < self.tiempo_max:
            evento = heapq.heappop(self.eventos_futuros)
            self.reloj = evento.tiempo
            self.procesar_evento(evento)
            self.registrar_estado(evento)
            self.iteracion += 1

        inicio = self.mostrar_desde
        fin = inicio + self.mostrar_cantidad

        promedio = self.acumulador_permanencia / self.contador_personas_que_ingresaron if self.contador_personas_que_ingresaron else 0
        total_llegadas = self.contador_personas_que_ingresaron + self.contador_rechazados_por_capacidad
        porcentaje_rechazo = (self.contador_rechazados_por_capacidad / total_llegadas) * 100 if total_llegadas else 0

        return {
            "vector_estado": self.vector_estado[inicio:fin],
            "estadisticas": {
                "promedio_permanencia": round(promedio, 2),
                "rechazo_por_capacidad": round(porcentaje_rechazo, 2)
            }
        }

    def procesar_evento(self, evento):
        if evento.tipo == TipoEvento.LLEGADA:
            persona = Persona(self.proximo_id, self.reloj, self.config)
            self.personas[self.proximo_id] = persona
            self.proximo_id += 1

            self.ultima_llegada_valor = self.reloj
            self.ultima_proxima_llegada = self.reloj + self.config.tiempo_entre_llegadas
            self.ultima_rnd_tramite = persona.rnd_tramite
            self.ultimo_tipo_tramite = persona.tramite.value

            if self.puede_entrar_al_sistema():
                persona.centro_cerrado = "No"
                self.contador_personas_que_ingresaron += 1
                self.cola.append(persona)
                self.intentar_atender()
            else:
                persona.centro_cerrado = "Sí"
                self.contador_rechazados_por_capacidad += 1
                # Eliminar persona destruida por capacidad
                persona.estado = EstadoPersona.DESTRUIDO
                del self.personas[persona.id]
            # Programar próxima llegada
            self.programar_evento(TipoEvento.LLEGADA, self.ultima_proxima_llegada)

        elif evento.tipo in [TipoEvento.FIN_CONSULTA, TipoEvento.FIN_ENTREGA]:
            self.finalizar_atencion(evento.persona_id)
            self.intentar_atender()

        elif evento.tipo == TipoEvento.FIN_SOLICITUD:
            self.finalizar_atencion(evento.persona_id)
            persona = self.personas.get(evento.persona_id)
            if persona is None:
                return
            self.rnd_actividad_secundaria = random.random()
            if self.rnd_actividad_secundaria < self.config.prob_se_va_tras_solicitud / 100:
                persona.estado = EstadoPersona.DESTRUIDO
                persona.hora_salida = self.reloj
                persona.tiempo_permanencia = self.reloj - persona.hora_llegada
                self.acumulador_permanencia += persona.tiempo_permanencia
                self.se_queda_ras = "No"
                self.rnd_valor_ras = None
                self.valor_ras = None
                self.reinsercion_actual = None
                # Eliminar persona destruida
                del self.personas[persona.id]
            else:
                persona.estado = EstadoPersona.REALIZANDO_ACTIVIDAD_SECUNDARIA
                self.se_queda_ras = "Sí"
                self.rnd_valor_ras = random.random()
                self.valor_ras = random.expovariate(1 / self.config.actividad_media)
                self.reinsercion_actual = round(self.reloj + self.valor_ras, 2)
                persona.reinsercion = self.reinsercion_actual
                self.programar_evento(TipoEvento.FIN_ACTIVIDAD_SECUNDARIA, self.reinsercion_actual, persona.id)

            self.intentar_atender()

        elif evento.tipo == TipoEvento.FIN_ACTIVIDAD_SECUNDARIA:
            persona = self.personas.get(evento.persona_id)
            if persona is None:
                return
            en_cola = len(self.cola)
            en_actividad_secundaria = len([
                p for p in self.personas.values()
                if p.estado == EstadoPersona.REALIZANDO_ACTIVIDAD_SECUNDARIA
            ])
            en_atencion = sum(
                1 for emp in self.empleados if not emp.libre and emp.persona_atendiendo is not None
            )
            if (en_cola + en_actividad_secundaria + en_atencion) < self.config.capacidad_maxima:
                persona.estado = EstadoPersona.ENTREGANDO_DOCUMENTOS
                persona.vino_de_actividad_secundaria = True
                self.cola.append(persona)
                self.intentar_atender()
            else:
                persona.estado = EstadoPersona.DESTRUIDO
                persona.hora_salida = self.reloj
                persona.tiempo_permanencia = self.reloj - persona.hora_llegada
                self.acumulador_permanencia += persona.tiempo_permanencia
                # Eliminar persona destruida
                del self.personas[persona.id]

    def puede_entrar_al_sistema(self):
        en_cola = len(self.cola)
        en_actividad_secundaria = len([
            p for p in self.personas.values()
            if p.estado == EstadoPersona.REALIZANDO_ACTIVIDAD_SECUNDARIA
        ])
        en_atencion = sum(
            1 for emp in self.empleados if not emp.libre and emp.persona_atendiendo is not None
        )
        return (en_cola + en_actividad_secundaria + en_atencion) < self.config.capacidad_maxima

    def intentar_atender(self):
        for emp in self.empleados:
            if emp.libre and self.cola:
                persona = self.cola.pop(0)
                emp.libre = False
                emp.persona_atendiendo = persona.id

                if persona.tramite == TipoTramite.SOLICITUD:
                    persona.estado = EstadoPersona.SOLICITANDO_DOCUMENTOS
                elif persona.tramite == TipoTramite.ENTREGA:
                    persona.estado = EstadoPersona.ENTREGANDO_DOCUMENTOS
                elif persona.tramite == TipoTramite.CONSULTA:
                    persona.estado = EstadoPersona.CONSULTANDO_REQUISITOS

                emp.rnd = random.random()
                emp.duracion = self.obtener_duracion(persona)
                emp.fin_atencion = round(self.reloj + emp.duracion, 2)
                self.programar_evento(self.tipo_evento_fin(persona), emp.fin_atencion, persona.id)

    def tipo_evento_fin(self, persona):
        if persona.tramite == TipoTramite.CONSULTA:
            return TipoEvento.FIN_CONSULTA
        elif persona.tramite == TipoTramite.ENTREGA:
            return TipoEvento.FIN_ENTREGA
        else:
            return TipoEvento.FIN_SOLICITUD

    def obtener_duracion(self, persona):
        if persona.tramite == TipoTramite.CONSULTA:
            return self.config.consulta_min + (self.config.consulta_max - self.config.consulta_min) * random.random()
        elif persona.tramite == TipoTramite.ENTREGA:
            min_entrega = self.config.entrega_media - self.config.entrega_rango
            max_entrega = self.config.entrega_media + self.config.entrega_rango
            return min_entrega + (max_entrega - min_entrega) * random.random()
        else:
            return -self.config.solicitud_media * math.log(1 - random.random())
    
    def finalizar_atencion(self, persona_id):
        persona = self.personas.get(persona_id)
        if persona is None:
            return
        for emp in self.empleados:
            if emp.persona_atendiendo == persona_id:
                emp.libre = True
                emp.persona_atendiendo = None
        if getattr(persona, "vino_de_actividad_secundaria", False):
            persona.estado = EstadoPersona.DESTRUIDO
            persona.hora_salida = self.reloj
            persona.tiempo_permanencia = self.reloj - persona.hora_llegada
            self.acumulador_permanencia += persona.tiempo_permanencia
            # Eliminar persona destruida
            del self.personas[persona.id]

    def registrar_estado(self, evento):
        clientes_data = [
            {
                "id": p.id,
                "hora_llegada": p.hora_llegada,
                "estado": p.estado,
                "reinsercion": p.reinsercion or "-",
                "centro_cerrado": p.centro_cerrado,
                "permanencia": round(p.tiempo_permanencia, 2) if p.estado == EstadoPersona.DESTRUIDO else "-"
            }
            for p in self.personas.values()
        ]

        estado = {
            "iteracion": self.iteracion,
            "reloj": round(self.reloj, 2),
            "evento": evento.tipo.value,

            "llegada_valor": self.ultima_llegada_valor,
            "proxima_llegada": self.ultima_proxima_llegada,
            "rnd_tramite": self.ultima_rnd_tramite,
            "tipo_tramite": self.ultimo_tipo_tramite,

            "empleado_1": {
                "libre": self.empleados[0].libre,
                "atendiendo": self.empleados[0].persona_atendiendo,
                "rnd": getattr(self.empleados[0], "rnd", None),
                "duracion": getattr(self.empleados[0], "duracion", None),
                "fin_atencion": getattr(self.empleados[0], "fin_atencion", None)
            },
            "empleado_2": {
                "libre": self.empleados[1].libre,
                "atendiendo": self.empleados[1].persona_atendiendo,
                "rnd": getattr(self.empleados[1], "rnd", None),
                "duracion": getattr(self.empleados[1], "duracion", None),
                "fin_atencion": getattr(self.empleados[1], "fin_atencion", None)
            },

            "rnd_ras": self.rnd_actividad_secundaria,
            "se_queda_ras": self.se_queda_ras,
            "rnd_valor_ras": self.rnd_valor_ras,
            "valor_ras": self.valor_ras,
            "reinsercion": self.reinsercion_actual,

            "cola": len(self.cola),
            "personas_local": len(self.cola) + len([
                p for p in self.personas.values()
                if p.estado == EstadoPersona.REALIZANDO_ACTIVIDAD_SECUNDARIA
            ]) + sum(
                1 for emp in self.empleados if not emp.libre and emp.persona_atendiendo is not None
            ),
            "acum_atendidos": self.contador_personas_que_ingresaron,
            "acum_permanencia": round(self.acumulador_permanencia, 2),
            "acum_no_ingresa": self.contador_rechazados_por_capacidad,

            "clientes": clientes_data
        }

        self.vector_estado.append(estado)
