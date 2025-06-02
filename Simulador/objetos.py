# objetos.py

class Cliente:
    def __init__(self, id, hora_llegada, tramite):
        self.id = id
        self.hora_llegada = hora_llegada
        self.estado = "en_cola"  # se actualizará si entra directo
        self.tramite = tramite
        self.hora_reinsercion = None
        self.tiempo_permanencia = None

    def marcar_destruido(self, hora_actual):
        self.estado = "destruido"
        self.tiempo_permanencia = hora_actual - self.hora_llegada


class Operador:
    def __init__(self, nombre):
        self.nombre = nombre
        self.estado = "libre"
        self.cliente_actual = None
        self.fin_atencion = None

    def asignar_cliente(self, cliente, hora_actual, duracion):
        self.estado = "ocupado"
        self.cliente_actual = cliente
        self.fin_atencion = hora_actual + duracion
        cliente.estado = cliente.tramite  # pasa a "consultando", "solicitando", etc.

    def liberar(self):
        self.estado = "libre"
        self.cliente_actual = None
        self.fin_atencion = None


class Centro:
    def __init__(self, capacidad_max=20):
        self.personas_dentro = 0
        self.capacidad_max = capacidad_max

    @property
    def estado(self):
        return "cerrado" if self.personas_dentro >= self.capacidad_max else "abierto"

    def ingresar(self):
        self.personas_dentro += 1

    def salir(self):
        self.personas_dentro -= 1

