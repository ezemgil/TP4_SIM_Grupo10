/**
 * Valida los parámetros del formulario de simulación.
 * @param {object} params
 * @returns {object} errors - Un objeto con los campos inválidos y su mensaje de error.
 */
export function validarParametros(params) {
  const errors = {};

  // Reglas generales
  const positivos = [
    "tiempo_simulacion",
    "cantidad_iteraciones",
    "mostrar_cantidad",
    "tiempo_entre_llegadas",
    "consulta_min",
    "consulta_max",
    "entrega_media",
    "entrega_rango",
    "solicitud_media",
    "actividad_media",
    "capacidad_maxima",
  ];
  positivos.forEach((key) => {
    if (
      params[key] === undefined ||
      params[key] === null ||
      isNaN(params[key]) ||
      params[key] <= 0
    ) {
      errors[key] = "Debe ser un número mayor a 0";
    }
  });

  // mostrar_desde puede ser 0 o mayor
  if (
    params.mostrar_desde === undefined ||
    params.mostrar_desde === null ||
    isNaN(params.mostrar_desde) ||
    params.mostrar_desde < 0
  ) {
    errors.mostrar_desde = "Debe ser un número mayor o igual a 0";
  }

  // Probabilidades entre 0 y 100
  const probabilidades = [
    "prob_solicitud",
    "prob_entrega",
    "prob_consulta",
    "prob_se_va_tras_solicitud",
  ];
  probabilidades.forEach((key) => {
    if (
      params[key] === undefined ||
      params[key] === null ||
      isNaN(params[key]) ||
      params[key] < 0 ||
      params[key] > 100
    ) {
      errors[key] = "Debe ser un valor entre 0 y 100";
    }
  });

  // La suma de prob_solicitud + prob_entrega + prob_consulta debe ser 100
  const sumaProb =
    Number(params.prob_solicitud || 0) +
    Number(params.prob_entrega || 0) +
    Number(params.prob_consulta || 0);
  if (sumaProb !== 100) {
    errors.prob_solicitud =
      "La suma de las probabilidades de solicitud, entrega y consulta debe ser 100";
    errors.prob_entrega =
      "La suma de las probabilidades de solicitud, entrega y consulta debe ser 100";
    errors.prob_consulta =
      "La suma de las probabilidades de solicitud, entrega y consulta debe ser 100";
  }

  // consulta_max debe ser mayor o igual a consulta_min
  if (
    !isNaN(params.consulta_min) &&
    !isNaN(params.consulta_max) &&
    params.consulta_max < params.consulta_min
  ) {
    errors.consulta_max = "Debe ser mayor o igual a Consulta Min";
  }

  // entrega_rango debe ser menor o igual a entrega_media
  if (
    !isNaN(params.entrega_media) &&
    !isNaN(params.entrega_rango) &&
    params.entrega_rango > params.entrega_media
  ) {
    errors.entrega_rango = "No puede ser mayor que Entrega Media";
  }

  // mostrar_cantidad no puede ser mayor que cantidad_iteraciones
  if (
    !isNaN(params.mostrar_cantidad) &&
    !isNaN(params.cantidad_iteraciones) &&
    params.mostrar_cantidad > params.cantidad_iteraciones
  ) {
    errors.mostrar_cantidad =
      "No puede ser mayor que la cantidad de iteraciones";
  }

  return errors;
}
