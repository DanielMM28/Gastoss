import { useEffect, useState } from "react"
import { supabase } from "../supabaseclient"
import Navbar from "../componentes/navbar"
import Sidebar from "../componentes/sidebar"
import "./tablero.css"

function DashboardMensual() {

  const [tableros, setTableros] = useState([])
  const [tableroId, setTableroId] = useState("")
  const [gastos, setGastos] = useState([])
  const [ingresos, setIngresos] = useState([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // 🔹 Paginación
  const [paginaGastos, setPaginaGastos] = useState(1)
  const [paginaIngresos, setPaginaIngresos] = useState(1)

  const gastosPorPagina = 5
  const ingresosPorPagina = 5

  // ==============================
  // 🔹 Obtener Tableros
  // ==============================
  const obtenerTableros = async () => {
    const { data, error } = await supabase
      .from("tablero")
      .select("*")
      .order("tablero_id", { ascending: true })

    if (error) {
      console.error("Error cargando tableros:", error.message)
      return
    }

    setTableros(data || [])
  }


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  // ==============================
  // 🔹 Obtener Datos por Mes
  // ==============================
  const obtenerDatos = async (id) => {
    setLoading(true)

    try {
      const { data: gastosData, error: errorGastos } = await supabase
        .from("gastos")
        .select("*")
        .eq("Tablero", id)

      const { data: ingresosData, error: errorIngresos } = await supabase
        .from("ingresos")
        .select("*")
        .eq("Tablero", id)

      if (errorGastos) throw errorGastos
      if (errorIngresos) throw errorIngresos

      setGastos(gastosData || [])
      setIngresos(ingresosData || [])

      // Reset paginación al cambiar mes
      setPaginaGastos(1)
      setPaginaIngresos(1)

    } catch (error) {
      console.error("Error obteniendo datos:", error.message)
    }

    setLoading(false)
  }

  // ==============================
  // 🔹 Obtener Resumen Anual
  // ==============================
  const obtenerResumenAnual = async () => {
    setLoading(true)

    try {
      const { data: gastosData } =
        await supabase.from("gastos").select("*")

      const { data: ingresosData } =
        await supabase.from("ingresos").select("*")

      setGastos(gastosData || [])
      setIngresos(ingresosData || [])

      setPaginaGastos(1)
      setPaginaIngresos(1)

    } catch (error) {
      console.error("Error cargando resumen anual:", error.message)
    }

    setLoading(false)
  }

  // ==============================
  // 🔹 Carga Inicial
  // ==============================
  useEffect(() => {
    obtenerTableros()
    obtenerResumenAnual()
  }, [])

  // ==============================
  // 🔹 Cambio de Mes
  // ==============================
  useEffect(() => {
    if (tableroId) {
      obtenerDatos(tableroId)
    } else {
      obtenerResumenAnual()
    }
  }, [tableroId])

  // ==============================
  // 🔹 Formato Moneda
  // ==============================
  const CambiarMoneda = (numero = 0) =>
    Number(numero).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP"
    })

  // ==============================
  // 🔹 Cálculos Totales
  // ==============================
  const totalGastos = gastos.reduce(
    (acc, g) => acc + Number(g.valor || 0),
    0
  )

  const totalIngresos = ingresos.reduce(
    (acc, i) => acc + Number(i.valor || 0),
    0
  )

  const balance = totalIngresos - totalGastos

  // ==============================
  // 🔹 Paginación Gastos
  // ==============================
  const indiceFinalGastos = paginaGastos * gastosPorPagina
  const indiceInicialGastos = indiceFinalGastos - gastosPorPagina
  const gastosActuales = gastos.slice(indiceInicialGastos, indiceFinalGastos)
  const totalPaginasGastos = Math.ceil(gastos.length / gastosPorPagina)

  // ==============================
  // 🔹 Paginación Ingresos
  // ==============================
  const indiceFinalIngresos = paginaIngresos * ingresosPorPagina
  const indiceInicialIngresos = indiceFinalIngresos - ingresosPorPagina
  const ingresosActuales = ingresos.slice(indiceInicialIngresos, indiceFinalIngresos)
  const totalPaginasIngresos = Math.ceil(ingresos.length / ingresosPorPagina)

  return (
    <div className="dashboard-layout">

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="main-section">

        <Navbar toggleSidebar={toggleSidebar} />

        <div className="dashboard-content">

          <h2 className="dashboard-title">
            {tableroId ? "Resumen del Mes" : "Resumen General del Año"}
          </h2>

          <div style={{ maxWidth: "260px" }} className="mb-5">
            <label className="form-label mb-2" style={{ fontWeight: 500 }}>
              Seleccionar Mes
            </label>

            <select
              className="saas-select"
              value={tableroId}
              onChange={(e) => setTableroId(e.target.value)}
            >
              <option value="">Resumen anual</option>

              {tableros.map((tablero) => (
                <option
                  key={tablero.tablero_id}
                  value={tablero.tablero_id}
                >
                  {tablero.Descripcion}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="text-center my-5">
              <div className="spinner-border" />
            </div>
          )}

          {!loading && (
            <>
              <div className="row g-4 mb-5">

                <div className="col-md-4">
                  <div className="saas-card">
                    <div className="card-label">Total Ingresos</div>
                    <div className="card-value text-income">
                      {CambiarMoneda(totalIngresos)}
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="saas-card">
                    <div className="card-label">Total Gastos</div>
                    <div className="card-value text-expense">
                      {CambiarMoneda(totalGastos)}
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="saas-card">
                    <div className="card-label">Balance</div>
                    <div
                      className={`card-value ${
                        balance >= 0
                          ? "text-balance-positive"
                          : "text-balance-negative"
                      }`}
                    >
                      {CambiarMoneda(balance)}
                    </div>
                  </div>
                </div>

              </div>

              <div className="row g-4">

                {/* LISTA GASTOS */}
                <div className="col-md-6">
                  <div className="saas-list">
                    <h6 className="mb-4" style={{ fontWeight: 600 }}>
                      Gastos
                    </h6>

                    {gastosActuales.length === 0 && (
                      <div className="text-muted">
                        No hay gastos registrados
                      </div>
                    )}

                    {gastosActuales.map(g => (
                      <div key={g.id} className="saas-list-item">
                        <span>{g.titulo}</span>
                        <span className="text-expense">
                          {CambiarMoneda(g.valor)}
                        </span>
                      </div>
                    ))}

  <div className="pagination-mini">
  <button
    className="pagination-btn"
    disabled={paginaGastos === 1}
    onClick={() => setPaginaGastos(paginaGastos - 1)}
  >
    ←
  </button>

  <span className="pagination-info">
    Página <strong>{paginaGastos}</strong> de{" "}
    <strong>{totalPaginasGastos || 1}</strong>
  </span>

  <button
    className="pagination-btn"
    disabled={
      paginaGastos === totalPaginasGastos ||
      totalPaginasGastos === 0
    }
    onClick={() => setPaginaGastos(paginaGastos + 1)}
  >
    →
  </button>
</div>

                  </div>
                </div>

                {/* LISTA INGRESOS */}
                <div className="col-md-6">
                  <div className="saas-list">
                    <h6 className="mb-4" style={{ fontWeight: 600 }}>
                      Ingresos
                    </h6>

                    {ingresosActuales.length === 0 && (
                      <div className="text-muted">
                        No hay ingresos registrados
                      </div>
                    )}

                    {ingresosActuales.map(i => (
                      <div key={i.id} className="saas-list-item">
                        <span>{i.Titulo}</span>
                        <span className="text-income">
                          {CambiarMoneda(i.valor)}
                        </span>
                      </div>
                    ))}

                    <div className="pagination-mini">
  <button
    className="pagination-btn"
    disabled={paginaIngresos === 1}
    onClick={() => setPaginaIngresos(paginaIngresos - 1)}
  >
    ←
  </button>

  <span className="pagination-info">
    Página <strong>{paginaIngresos}</strong> de{" "}
    <strong>{totalPaginasIngresos || 1}</strong>
  </span>

  <button
    className="pagination-btn"
    disabled={
      paginaIngresos === totalPaginasIngresos ||
      totalPaginasIngresos === 0
    }
    onClick={() => setPaginaIngresos(paginaIngresos + 1)}
  >
    →
  </button>
</div>

                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default DashboardMensual