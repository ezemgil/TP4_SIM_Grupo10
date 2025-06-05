"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import {
  BarChart3,
  Clock,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

export default function VectorDeEstado({ vector, estadisticas }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const maxClientes = 10

  // Calcular paginación
  const totalItems = vector.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = vector.slice(startIndex, endIndex)

  // Funciones de navegación
  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToPreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1))
  const goToNextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1))
  const goToPage = (page) => setCurrentPage(page)

  // Cambiar items por página
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset a la primera página
  }

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const delta = 2 // Número de páginas a mostrar a cada lado de la página actual
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      if (totalPages > 1) rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const formatValue = (value) => {
    if (value === null || value === undefined) return "-"
    if (typeof value === "number") {
      return Number.isInteger(value) ? value.toString() : value.toFixed(2)
    }
    return value.toString()
  }

  const getBooleanBadge = (value) => {
    if (value === null || value === undefined) return "-"
    return (
      <Badge
        variant={value ? "default" : "secondary"}
        className={`text-xs ${
          value
            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
            : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700"
        }`}
      >
        {value ? "Sí" : "No"}
      </Badge>
    )
  }

  const getEstadoBadge = (estado) => {
    if (!estado) return "-"

    const variants = {
      esperando: { bg: "bg-gradient-to-r from-yellow-500 to-orange-500", text: "text-white" },
      atendido: { bg: "bg-gradient-to-r from-green-500 to-emerald-500", text: "text-white" },
      libre: { bg: "bg-gradient-to-r from-gray-400 to-gray-500", text: "text-white" },
      ocupado: { bg: "bg-gradient-to-r from-red-500 to-pink-500", text: "text-white" },
    }

    const variant = variants[estado.toLowerCase()] || {
      bg: "bg-gray-200",
      text: "text-gray-800",
    }

    return <Badge className={`text-xs ${variant.bg} ${variant.text} border-0`}>{estado}</Badge>
  }

  return (
    <div className="w-full space-y-6">
      <Card className="border-2 border-blue-200 bg-white shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <BarChart3 className="h-5 w-5" />
                Vector de Estado - Resultados de Simulación
              </CardTitle>
              <CardDescription className="text-blue-700">
                Tabla detallada con todos los eventos y estados del sistema durante la simulación
              </CardDescription>
            </div>

            {/* Controles de paginación superior */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Mostrar:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">por página</span>
              </div>

              <div className="text-sm text-gray-600">
                Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} registros
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="overflow-x-auto">
              <table className="min-w-[2400px] border border-gray-200 text-sm">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50 sticky top-0 z-10">
                  <tr>
                    {/* Basic Event Info */}
                    <th className="border border-gray-200 px-2 py-2 bg-gradient-to-r from-gray-100 to-blue-50 sticky left-0 z-20 font-semibold text-gray-700">
                      Evento
                    </th>
                    <th className="border border-gray-200 px-2 py-2 bg-gradient-to-r from-gray-100 to-blue-50 sticky left-[100px] z-20 font-semibold text-gray-700">
                      Reloj
                    </th>

                    {/* Arrival Info */}
                    <th className="border border-gray-200 px-2 py-2 bg-blue-50 font-semibold text-blue-700">
                      Llegada Cliente - Valor
                    </th>
                    <th className="border border-gray-200 px-2 py-2 bg-blue-50 font-semibold text-blue-700">
                      Llegada Cliente - Próxima Llegada
                    </th>

                    {/* Transaction Info */}
                    <th className="border border-gray-200 px-2 py-2 bg-purple-50 font-semibold text-purple-700">
                      Trámite - RND
                    </th>
                    <th className="border border-gray-200 px-2 py-2 bg-purple-50 font-semibold text-purple-700">
                      Trámite - Tipo
                    </th>

                    {/* Employee 1 */}
                    <th className="border border-gray-200 px-2 py-2 bg-green-50 font-semibold text-green-700">
                      Emp1 - Estado
                    </th>
                    <th className="border border-gray-200 px-2 py-2 bg-green-50 font-semibold text-green-700">
                      Emp1 - RND
                    </th>
                    <th className="border border-gray-200 px-2 py-2 bg-green-50 font-semibold text-green-700">
                      Emp1 - Duración
                    </th>
                    <th className="border border-gray-200 px-2 py-2 bg-green-50 font-semibold text-green-700">
                      Emp1 - Fin Atención
                    </th>

                    {/* Employee 2 */}
                    <th className="border border-gray-200 px-2 py-2 bg-orange-50 font-semibold text-orange-700">
                      Emp2 - Estado
                    </th>
                    <th className="border border-gray-200 px-2 py-2 bg-orange-50 font-semibold text-orange-700">
                      Emp2 - RND
                    </th>
                    <th className="border border-gray-200 px-2 py-2 bg-orange-50 font-semibold text-orange-700">
                      Emp2 - Duración
                    </th>
                    <th className="border border-gray-200 px-2 py-2 bg-orange-50 font-semibold text-orange-700">
                      Emp2 - Fin Atención
                    </th>

                    {/* Secondary Activities */}
                    <th className="border border-gray-200 px-2 py-2 bg-red-50 font-semibold text-red-700">RAS - RND</th>
                    <th className="border border-gray-200 px-2 py-2 bg-red-50 font-semibold text-red-700">
                      RAS - ¿Se queda?
                    </th>
                    <th className="border border-gray-200 px-2 py-2 bg-red-50 font-semibold text-red-700">
                      RAS - RND Valor
                    </th>
                    <th className="border border-gray-200 px-2 py-2 bg-red-50 font-semibold text-red-700">
                      RAS - Valor
                    </th>
                    <th className="border border-gray-200 px-2 py-2 bg-red-50 font-semibold text-red-700">
                      RAS - Reinserción
                    </th>

                    {/* System State */}
                    <th className="border border-gray-200 px-2 py-2 bg-gray-50 font-semibold text-gray-700">Cola</th>
                    <th className="border border-gray-200 px-2 py-2 bg-gray-50 font-semibold text-gray-700">
                      Personas Local
                    </th>
                    <th className="border border-gray-200 px-2 py-2 bg-gray-50 font-semibold text-gray-700">
                      Acum. Atendidos
                    </th>
                    <th className="border border-gray-200 px-2 py-2 bg-gray-50 font-semibold text-gray-700">
                      Acum. Permanencia
                    </th>
                    <th className="border border-gray-200 px-2 py-2 bg-gray-50 font-semibold text-gray-700">
                      Acum. No Ingresa
                    </th>

                    {/* Clients */}
                    {Array.from({ length: maxClientes }, (_, i) => (
                      <>
                        <th
                          key={`c${i}-id`}
                          className="border border-gray-200 px-2 py-2 bg-indigo-50 font-semibold text-indigo-700"
                        >
                          Cliente {i + 1} - ID
                        </th>
                        <th
                          key={`c${i}-hora`}
                          className="border border-gray-200 px-2 py-2 bg-indigo-50 font-semibold text-indigo-700"
                        >
                          Hora Llegada
                        </th>
                        <th
                          key={`c${i}-estado`}
                          className="border border-gray-200 px-2 py-2 bg-indigo-50 font-semibold text-indigo-700"
                        >
                          Estado
                        </th>
                        <th
                          key={`c${i}-reins`}
                          className="border border-gray-200 px-2 py-2 bg-indigo-50 font-semibold text-indigo-700"
                        >
                          Reinserción
                        </th>
                        <th
                          key={`c${i}-cerrado`}
                          className="border border-gray-200 px-2 py-2 bg-indigo-50 font-semibold text-indigo-700"
                        >
                          Centro Cerrado
                        </th>
                        <th
                          key={`c${i}-perm`}
                          className="border border-gray-200 px-2 py-2 bg-indigo-50 font-semibold text-indigo-700"
                        >
                          T. Permanencia
                        </th>
                      </>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((fila, idx) => (
                    <tr
                      key={startIndex + idx}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition-colors duration-200`}
                    >
                      {/* Basic Event Info */}
                      <td className="border border-gray-200 px-2 py-2 bg-white sticky left-0 z-10">
                        <Badge
                          variant="outline"
                          className="text-xs border-blue-200 text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50"
                        >
                          {fila.evento}
                        </Badge>
                      </td>
                      <td className="border border-gray-200 px-2 py-2 bg-white sticky left-[100px] z-10 font-mono text-gray-700">
                        {formatValue(fila.reloj)}
                      </td>

                      {/* Arrival Info */}
                      <td className="border border-gray-200 px-2 py-2 font-mono text-gray-700">
                        {fila.llegada_valor ?? "-"}
                      </td>
                      <td className="border border-gray-200 px-2 py-2 font-mono text-gray-700">
                        {fila.proxima_llegada ?? "-"}
                      </td>

                      {/* Transaction Info */}
                      <td className="border border-gray-200 px-2 py-2 font-mono text-gray-700">
                        {fila.rnd_tramite ?? "-"}
                      </td>
                      <td className="border border-gray-200 px-2 py-2">
                        {fila.tipo_tramite ? (
                          <Badge className="text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0">
                            {fila.tipo_tramite}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* Employee 1 */}
                      <td className="border border-gray-200 px-2 py-2">
                        {fila.empleado_1?.libre ? (
                          <Badge className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                            Libre
                          </Badge>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <Badge className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                              Ocupado
                            </Badge>
                            <span className="text-xs text-gray-500">({fila.empleado_1?.atendiendo})</span>
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-200 px-2 py-2 font-mono text-gray-700">
                        {fila.empleado_1?.rnd ?? "-"}
                      </td>
                      <td className="border border-gray-200 px-2 py-2 font-mono text-gray-700">
                        {fila.empleado_1?.duracion ?? "-"}
                      </td>
                      <td className="border border-gray-200 px-2 py-2 font-mono text-gray-700">
                        {fila.empleado_1?.fin_atencion ?? "-"}
                      </td>

                      {/* Employee 2 */}
                      <td className="border border-gray-200 px-2 py-2">
                        {fila.empleado_2?.libre ? (
                          <Badge className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                            Libre
                          </Badge>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <Badge className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                              Ocupado
                            </Badge>
                            <span className="text-xs text-gray-500">({fila.empleado_2?.atendiendo})</span>
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-200 px-2 py-2 font-mono text-gray-700">
                        {fila.empleado_2?.rnd ?? "-"}
                      </td>
                      <td className="border border-gray-200 px-2 py-2 font-mono text-gray-700">
                        {fila.empleado_2?.duracion ?? "-"}
                      </td>
                      <td className="border border-gray-200 px-2 py-2 font-mono text-gray-700">
                        {fila.empleado_2?.fin_atencion ?? "-"}
                      </td>

                      {/* Secondary Activities */}
                      <td className="border border-gray-200 px-2 py-2 font-mono text-gray-700">
                        {fila.rnd_ras ?? "-"}
                      </td>
                      <td className="border border-gray-200 px-2 py-2">{getBooleanBadge(fila.se_queda_ras)}</td>
                      <td className="border border-gray-200 px-2 py-2 font-mono text-gray-700">
                        {fila.rnd_valor_ras ?? "-"}
                      </td>
                      <td className="border border-gray-200 px-2 py-2 font-mono text-gray-700">
                        {fila.valor_ras ?? "-"}
                      </td>
                      <td className="border border-gray-200 px-2 py-2 font-mono text-gray-700">
                        {fila.reinsercion ?? "-"}
                      </td>

                      {/* System State */}
                      <td className="border border-gray-200 px-2 py-2 text-center">
                        <Badge className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
                          {fila.cola}
                        </Badge>
                      </td>
                      <td className="border border-gray-200 px-2 py-2 text-center">
                        <Badge className="text-xs bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
                          {fila.personas_local}
                        </Badge>
                      </td>
                      <td className="border border-gray-200 px-2 py-2 font-mono text-gray-700">
                        {fila.acum_atendidos}
                      </td>
                      <td className="border border-gray-200 px-2 py-2 font-mono text-gray-700">
                        {fila.acum_permanencia}
                      </td>
                      <td className="border border-gray-200 px-2 py-2 font-mono text-gray-700">
                        {fila.acum_no_ingresa}
                      </td>

                      {/* Clients */}
                      {Array.from({ length: maxClientes }).map((_, i) => {
                        const c = fila.clientes?.[i]
                        return (
                          <>
                            <td key={`${startIndex + idx}-c${i}-id`} className="border border-gray-200 px-2 py-2">
                              {c?.id ? (
                                <Badge className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                                  {c.id}
                                </Badge>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td
                              key={`${startIndex + idx}-c${i}-hora`}
                              className="border border-gray-200 px-2 py-2 font-mono text-gray-700"
                            >
                              {c?.hora_llegada ?? "-"}
                            </td>
                            <td key={`${startIndex + idx}-c${i}-estado`} className="border border-gray-200 px-2 py-2">
                              {getEstadoBadge(c?.estado)}
                            </td>
                            <td
                              key={`${startIndex + idx}-c${i}-reins`}
                              className="border border-gray-200 px-2 py-2 font-mono text-gray-700"
                            >
                              {c?.reinsercion ?? "-"}
                            </td>
                            <td key={`${startIndex + idx}-c${i}-cerrado`} className="border border-gray-200 px-2 py-2">
                              {getBooleanBadge(c?.centro_cerrado)}
                            </td>
                            <td
                              key={`${startIndex + idx}-c${i}-perm`}
                              className="border border-gray-200 px-2 py-2 font-mono text-gray-700"
                            >
                              {c?.permanencia ?? "-"}
                            </td>
                          </>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Controles de paginación inferior */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <span>•</span>
              <span>{totalItems} registros en total</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Ir a primera página */}
              <Button
                variant="outline"
                size="sm"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 hover:bg-blue-50 border-blue-200"
                title="Primera página"
              >
                <ChevronsLeft className="h-4 w-4 text-blue-600" />
              </Button>

              {/* Página anterior */}
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 hover:bg-blue-50 border-blue-200"
                title="Página anterior"
              >
                <ChevronLeft className="h-4 w-4 text-blue-600" />
              </Button>

              {/* Números de página */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNumber, index) => (
                  <div key={index}>
                    {pageNumber === "..." ? (
                      <span className="px-3 py-1 text-gray-500 text-sm">...</span>
                    ) : (
                      <Button
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNumber)}
                        className={`h-8 min-w-8 px-2 text-sm ${
                          currentPage === pageNumber
                            ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                            : "hover:bg-blue-50 border-blue-200 text-blue-600"
                        }`}
                      >
                        {pageNumber}
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Página siguiente */}
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 hover:bg-blue-50 border-blue-200"
                title="Página siguiente"
              >
                <ChevronRight className="h-4 w-4 text-blue-600" />
              </Button>

              {/* Ir a última página */}
              <Button
                variant="outline"
                size="sm"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 hover:bg-blue-50 border-blue-200"
                title="Última página"
              >
                <ChevronsRight className="h-4 w-4 text-blue-600" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <Card className="border-2 border-blue-200 bg-white shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <TrendingUp className="h-5 w-5" />
            Estadísticas Finales
          </CardTitle>
          <CardDescription className="text-blue-700">Resumen de los resultados de la simulación</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg">
              <div className="p-3 bg-white/20 rounded-full">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-100">Promedio de Permanencia</p>
                <p className="text-3xl font-bold text-white">{formatValue(estadisticas.promedio_permanencia)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg shadow-lg">
              <div className="p-3 bg-white/20 rounded-full">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-100">% Rechazo por Capacidad</p>
                <p className="text-3xl font-bold text-white">{formatValue(estadisticas.rechazo_por_capacidad)}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
