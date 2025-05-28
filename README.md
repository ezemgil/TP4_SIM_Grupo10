# Trabajo Práctico 4 - Simulación
## Centro de Documentación Municipal
### Ciclo lectivo 2025 - 4K2 | Grupo 10

![Centro de Documentación - Ejemplo de Colas](https://sp-ao.shortpixel.ai/client/to_auto,q_lossless,ret_img,w_1000,h_509/https://www.rsiconcepts.com/blog/wp-content/uploads/2023/05/From-Chaos-to-Control-How-Queue-Management-Systems-Can-Improve-Your-Business-2.jpg)

---

## Enunciado

En un Centro de Documentación Municipal, las personas llegan cada **4** minutos para realizar distintos trámites. Hay dos empleados en el mostrador, ambos capacitados para realizar cualquiera de las siguientes gestiones:

- **Solicitar documentos personales nuevos** (45%)
- **Entregar documentación requerida previamente** (45%)
- **Consultar requisitos para trámites futuros** (10%)

Las consultas demoran entre **2 y 5 minutos** (distribución uniforme).  
La entrega de documentos insume **2 ± 0,5 minutos**.  
La gestión de una nueva solicitud tiene una duración **exponencial negativa con media de 6 minutos**.

De las personas que inician un trámite de solicitud, el **60%** se retira del centro al terminar. El resto permanece dentro del edificio completando formularios, solicitando ayuda o esperando turnos secundarios, lo que insume en promedio **30 minutos**. Luego, deben regresar al mostrador para entregar formularios o pedir aclaraciones (haciendo cola si es necesario).

El centro tiene una **política sanitaria de máximo 20 personas** simultáneamente dentro del edificio. Si se alcanza este número, se cierran las puertas momentáneamente y las personas que lleguen durante ese lapso no pueden ingresar.

---

### Objetivos de la Simulación

- Establecer el **promedio de permanencia** de las personas que ingresan al centro.
- Determinar **qué porcentaje de personas llegan y encuentran el centro cerrado** por haber alcanzado su capacidad máxima.

## Parámetros de la Simulación

Las siguientes variables presentes en el archivo `config.py` permiten ajustar el comportamiento de la simulación:

- `TIEMPO_ENTRE_LLEGADAS`: Tiempo promedio entre llegadas de personas al centro (en minutos). **Valor por defecto:** 4.

- ### Probabilidades de gestión:
  - `PROB_SOLICITUD`: Probabilidad de que una persona solicite un documento nuevo. **Valor por defecto:** 0.45.
  - `PROB_ENTREGA`: Probabilidad de que una persona entregue documentación requerida. **Valor por defecto:** 0.45.
  - `PROB_CONSULTA`: Probabilidad de que una persona consulte requisitos para trámites futuros. **Valor por defecto:** 0.10.
- > 📝***Nota**: la suma de estas probabilidades debe ser igual a 1.*

- ### Distribución de duración de trámites:
  - `DURACION_CONSULTA`: Sigue una distribución **uniforme** entre 2 y 5 minutos. **Valor por defecto:** (2, 5).
  - `DURACION_ENTREGA`: Sigue una distribución **normal** con media de 2 minutos y desviación estándar de 0.5 minutos. **Valor por defecto:** (2, 0.5).
  - `DURACION_SOLICITUD`: Sigue una distribución **exponencial negativa** con media de 6 minutos. **Valor por defecto:** 6.

- `PORCENTAJE_RETIRO`: Porcentaje de personas que se retiran del centro al finalizar su trámite de solicitud. **Valor por defecto:** 0.60.
- `TIEMPO_MAXIMO_EN_CENTRO`: Tiempo máximo que una persona puede permanecer en el centro (en minutos). **Valor por defecto:** 30.
