import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { Progress } from "./ui/progress"
import { Play, Settings, Clock, Users, TrendingUp, Loader2 } from 'lucide-react'

export default function SimulatorForm({ onSimular, isLoading = false }) {
  const [params, setParams] = useState({
    tiempo_simulacion: 100,
    cantidad_iteraciones: 1000,
    mostrar_desde: 0,
    mostrar_cantidad: 10,
    tiempo_entre_llegadas: 4,
    prob_solicitud: 45,
    prob_entrega: 45,
    prob_consulta: 10,
    consulta_min: 2,
    consulta_max: 5,
    entrega_media: 2,
    entrega_rango: 0.5,
    solicitud_media: 6,
    actividad_media: 30,
    prob_se_va_tras_solicitud: 60,
    capacidad_maxima: 20,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setParams({ ...params, [name]: Number.parseFloat(value) })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSimular(params)
  }

  const formatLabel = (key) => {
    return key
      .replaceAll("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Simulation Configuration */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl text-blue-900">
              <Settings className="h-5 w-5" />
              Configuración de Simulación
            </CardTitle>
            <CardDescription className="text-blue-700">
              Parámetros básicos para la ejecución de la simulación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tiempo_simulacion" className="text-sm font-medium text-gray-700">
                  {formatLabel("tiempo_simulacion")}
                </Label>
                <Input
                  id="tiempo_simulacion"
                  type="number"
                  step="0.1"
                  name="tiempo_simulacion"
                  value={params.tiempo_simulacion}
                  onChange={handleChange}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-600">Duración total de la simulación</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cantidad_iteraciones" className="text-sm font-medium text-gray-700">
                  {formatLabel("cantidad_iteraciones")}
                </Label>
                <Input
                  id="cantidad_iteraciones"
                  type="number"
                  step="0.1"
                  name="cantidad_iteraciones"
                  value={params.cantidad_iteraciones}
                  onChange={handleChange}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-600">Número de iteraciones a ejecutar</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mostrar_desde" className="text-sm font-medium text-gray-700">
                  {formatLabel("mostrar_desde")}
                </Label>
                <Input
                  id="mostrar_desde"
                  type="number"
                  step="0.1"
                  name="mostrar_desde"
                  value={params.mostrar_desde}
                  onChange={handleChange}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-600">Punto de inicio para mostrar resultados</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mostrar_cantidad" className="text-sm font-medium text-gray-700">
                  {formatLabel("mostrar_cantidad")}
                </Label>
                <Input
                  id="mostrar_cantidad"
                  type="number"
                  step="0.1"
                  name="mostrar_cantidad"
                  value={params.mostrar_cantidad}
                  onChange={handleChange}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-600">Cantidad de resultados a mostrar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Arrival Parameters */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl text-green-900">
              <Clock className="h-5 w-5" />
              Parámetros de Llegada
            </CardTitle>
            <CardDescription className="text-green-700">
              Configuración de tiempos y capacidades del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tiempo_entre_llegadas" className="text-sm font-medium text-gray-700">
                  {formatLabel("tiempo_entre_llegadas")}
                </Label>
                <Input
                  id="tiempo_entre_llegadas"
                  type="number"
                  step="0.1"
                  name="tiempo_entre_llegadas"
                  value={params.tiempo_entre_llegadas}
                  onChange={handleChange}
                  className="border-green-200 focus:border-green-400 focus:ring-green-400"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-600">Tiempo promedio entre llegadas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacidad_maxima" className="text-sm font-medium text-gray-700">
                  {formatLabel("capacidad_maxima")}
                </Label>
                <Input
                  id="capacidad_maxima"
                  type="number"
                  step="0.1"
                  name="capacidad_maxima"
                  value={params.capacidad_maxima}
                  onChange={handleChange}
                  className="border-green-200 focus:border-green-400 focus:ring-green-400"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-600">Capacidad máxima del sistema</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Probability Parameters */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl text-purple-900">
              <TrendingUp className="h-5 w-5" />
              Probabilidades
            </CardTitle>
            <CardDescription className="text-purple-700">
              Distribución de probabilidades para diferentes eventos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["prob_solicitud", "prob_entrega", "prob_consulta", "prob_se_va_tras_solicitud"].map((key) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-sm font-medium text-gray-700">
                    {formatLabel(key)}
                  </Label>
                  <div className="relative">
                    <Input
                      id={key}
                      type="number"
                      step="0.1"
                      name={key}
                      value={params[key]}
                      onChange={handleChange}
                      className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 pr-8"
                      min="0"
                      max="100"
                      disabled={isLoading}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">%</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {key === "prob_solicitud" && "Probabilidad de solicitud (%)"}
                    {key === "prob_entrega" && "Probabilidad de entrega (%)"}
                    {key === "prob_consulta" && "Probabilidad de consulta (%)"}
                    {key === "prob_se_va_tras_solicitud" && "Probabilidad de irse tras solicitud (%)"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Parameters */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl text-orange-900">
              <Users className="h-5 w-5" />
              Parámetros de Servicio
            </CardTitle>
            <CardDescription className="text-orange-700">
              Tiempos de servicio y configuraciones operativas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "consulta_min",
                "consulta_max",
                "entrega_media",
                "entrega_rango",
                "solicitud_media",
                "actividad_media",
              ].map((key) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-sm font-medium text-gray-700">
                    {formatLabel(key)}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    step="0.1"
                    name={key}
                    value={params[key]}
                    onChange={handleChange}
                    className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-600">
                    {key === "consulta_min" && "Tiempo mínimo de consulta"}
                    {key === "consulta_max" && "Tiempo máximo de consulta"}
                    {key === "entrega_media" && "Tiempo promedio de entrega"}
                    {key === "entrega_rango" && "Rango de variación de entrega"}
                    {key === "solicitud_media" && "Tiempo promedio de solicitud"}
                    {key === "actividad_media" && "Tiempo promedio de actividad"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Submit Button and Loading State */}
        <div className="flex flex-col items-center space-y-4">
          {isLoading && (
            <div className="w-full max-w-md space-y-2">
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Ejecutando simulación...</span>
              </div>
              <Progress value={66} className="w-full" />
              <p className="text-xs text-center text-gray-600">Procesando parámetros y generando resultados</p>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="px-12 py-3 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg text-white font-semibold transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Simulando...
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Simular
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}