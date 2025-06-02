# simulador.py
from heapq import heappush, heappop
from objetos import Cliente, Operador, Centro
from modelos import FilaEstado
from constantes import *
import random
import json

def generar_tramite(rnd) -> str:
    r = rnd
    if r < PROBABILIDADES_TRAMITE["solicitud"]:
        return "solicitud"
    elif r < PROBABILIDADES_TRAMITE["solicitud"] + PROBABILIDADES_TRAMITE["entrega"]:
        return "entrega"
    return "consulta"

def generar_duracion(tramite: str) -> float:
    dist = DISTRIBUCIONES[tramite]
    if dist["tipo"] == "uniforme":
        return random.uniform(dist["a"], dist["b"])
    elif dist["tipo"] == "exponencial":
        return random.expovariate(1 / dist["media"])
    return 0

def simular(tiempo_maximo: int, max_iteraciones: int):
    estado = []
    iteracion = 0
    hora_actual = 0.0

    centro = Centro()
    operador_1 = Operador("Operador 1")
    operador_2 = Operador("Operador 2")
    cola = 0

    clientes = []
    cliente_id = 1

    eventos = []
    heappush(eventos, (0.0, "Llegada", None))

    while eventos and iteracion < max_iteraciones and hora_actual <= tiempo_maximo:
        hora_actual, evento, datos = heappop(eventos)

        rnd = None
        tramite = None
        duracion = None
        cliente = None

        if evento == "Llegada":
            if centro.estado == "abierto":
                rnd = random.random()
                tramite = generar_tramite(rnd)
                cliente = Cliente(cliente_id, hora_actual, tramite)
                clientes.append(cliente)
                cliente_id += 1
                centro.ingresar()

                duracion = generar_duracion(tramite)
                asignado = False

                if operador_1.estado == "libre":
                    operador_1.asignar_cliente(cliente, hora_actual, duracion)
                    heappush(eventos, (operador_1.fin_atencion, "Fin atención 1", operador_1.cliente_actual))
                    asignado = True
                elif operador_2.estado == "libre":
                    operador_2.asignar_cliente(cliente, hora_actual, duracion)
                    heappush(eventos, (operador_2.fin_atencion, "Fin atención 2", operador_2.cliente_actual))
                    asignado = True

                if not asignado:
                    cliente.estado = "en_cola"
                    cola += 1
            else:
                # no entra, el centro está cerrado
                pass

            # programar nueva llegada
            heappush(eventos, (hora_actual + TIEMPO_LLEGADA, "Llegada", None))

        elif evento.startswith("Fin atención"):
            operador = operador_1 if "1" in evento else operador_2
            cliente = operador.cliente_actual

            if cliente.tramite == "solicitud":
                if random.random() < 0.4:
                    espera = random.expovariate(1 / 30)
                    cliente.estado = "actividades_secundarias"
                    cliente.hora_reinsercion = hora_actual + espera
                    heappush(eventos, (cliente.hora_reinsercion, "Reinserción", cliente))
                else:
                    cliente.marcar_destruido(hora_actual)
                    centro.salir()
            else:
                cliente.marcar_destruido(hora_actual)
                centro.salir()

            operador.liberar()

            # ¿hay alguien en cola?
            if cola > 0:
                cola -= 1
                tramite = random.choices(["entrega", "consulta"], weights=[0.8, 0.2])[0]
                cliente = Cliente(cliente_id, hora_actual, tramite)
                clientes.append(cliente)
                cliente_id += 1
                centro.ingresar()
                duracion = generar_duracion(tramite)
                operador.asignar_cliente(cliente, hora_actual, duracion)
                heappush(eventos, (operador.fin_atencion, evento, cliente))

        elif evento == "Reinserción":
            cliente = datos
            tramite = random.choices(["entrega", "consulta"], weights=[0.8, 0.2])[0]
            cliente.tramite = tramite
            cliente.estado = "en_cola"  # hasta que lo asignemos

            if operador_1.estado == "libre":
                duracion = generar_duracion(tramite)
                operador_1.asignar_cliente(cliente, hora_actual, duracion)
                heappush(eventos, (operador_1.fin_atencion, "Fin atención 1", cliente))
                cliente.estado = tramite
            elif operador_2.estado == "libre":
                duracion = generar_duracion(tramite)
                operador_2.asignar_cliente(cliente, hora_actual, duracion)
                heappush(eventos, (operador_2.fin_atencion, "Fin atención 2", cliente))
                cliente.estado = tramite
            else:
                cola += 1

        # crear fila del vector de estado
        fila = FilaEstado(
            hora=hora_actual,
            evento=evento,
            rnd_tipo_tramite=rnd,
            tipo_tramite=tramite,
            tiempo_atencion=duracion,
            fin_atencion_1=operador_1.fin_atencion,
            fin_atencion_2=operador_2.fin_atencion,
            estado_empleado_1=operador_1.estado,
            estado_empleado_2=operador_2.estado,
            tramite_empleado_1=operador_1.cliente_actual.tramite if operador_1.cliente_actual else None,
            tramite_empleado_2=operador_2.cliente_actual.tramite if operador_2.cliente_actual else None,
            cola_espera=cola,
            personas_dentro=centro.personas_dentro,
            variables_auxiliares={}
        )
        estado.append(fila)
        iteracion += 1

    with open("estado_actual.json", "w") as f:
        json.dump([f.dict() for f in estado], f, indent=2)

    return estado
