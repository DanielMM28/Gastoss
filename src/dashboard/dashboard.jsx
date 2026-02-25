import "./dashboard.css"
import Navbar from "../componentes/navbar"
import Sidebar from "../componentes/sidebar"
import { useEffect, useState } from "react"
import { supabase } from "../supabaseclient"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts"

export default function Dashboard() {

  const [tableros, setTableros] = useState([])
  const [tableroId, setTableroId] = useState("")
  const [gastos, setGastos] = useState([])
  const [ingresos, setIngresos] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Detectar tamaño pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
const [sidebarOpen, setSidebarOpen] = useState(false)

const toggleSidebar = () => {
  setSidebarOpen(!sidebarOpen)
}
  // Carga inicial
  useEffect(() => {
    obtenerTableros()
    obtenerResumenMensual()
  }, [])

  useEffect(() => {
    if (tableroId) {
      obtenerDatos(tableroId)
    } else {
      obtenerResumenMensual()
    }
  }, [tableroId])

  // ===============================
  // Obtener meses
  // ===============================
  const obtenerTableros = async () => {
    const { data } = await supabase
      .from("tablero")
      .select("*")
      .order("tablero_id", { ascending: true })

    setTableros(data || [])
  }

  // ===============================
  // Obtener datos por mes
  // ===============================
  const obtenerDatos = async (id) => {

    const { data: gastosData } = await supabase
      .from("gastos")
      .select(`*, tablero:Tablero (Descripcion)`)
      .eq("Tablero", id)

    const { data: ingresosData } = await supabase
      .from("ingresos")
      .select(`*, tablero:Tablero (Descripcion)`)
      .eq("Tablero", id)

    setGastos(gastosData || [])
    setIngresos(ingresosData || [])
  }

  // ===============================
  // Resumen general
  // ===============================
  const obtenerResumenMensual = async () => {

    const { data: gastosData } = await supabase
      .from("gastos")
      .select(`*, tablero:Tablero (Descripcion)`)

    const { data: ingresosData } = await supabase
      .from("ingresos")
      .select(`*, tablero:Tablero (Descripcion)`)

    setGastos(gastosData || [])
    setIngresos(ingresosData || [])
  }

  const CambiarMoneda = (numero = 0) =>
    Number(numero).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP"
    })

  const totalGastos = gastos.reduce((acc, g) => acc + Number(g.valor || 0), 0)
  const totalIngresos = ingresos.reduce((acc, i) => acc + Number(i.valor || 0), 0)
  const balance = totalIngresos - totalGastos

  // ===============================
  // Orden oficial de meses
  // ===============================
  const ordenMeses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ]

  const agruparPorMes = () => {

    const resumen = {}

    ordenMeses.forEach((mes) => {
      resumen[mes] = { mes, Ingresos: 0, Gastos: 0 }
    })

    const limpiarMes = (texto) =>
      texto?.trim().replace(/\n/g, "")

    gastos.forEach((g) => {
      const mesLimpio = limpiarMes(g.tablero?.Descripcion)
      if (resumen[mesLimpio]) {
        resumen[mesLimpio].Gastos += Number(g.valor || 0)
      }
    })

    ingresos.forEach((i) => {
      const mesLimpio = limpiarMes(i.tablero?.Descripcion)
      if (resumen[mesLimpio]) {
        resumen[mesLimpio].Ingresos += Number(i.valor || 0)
      }
    })

    return ordenMeses.map((mes) => resumen[mes])
  }

  const dataChart = agruparPorMes()

  // ===============================
  // RENDER
  // ===============================

  return (
    <div className="dashboard-layout">

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="main-section">
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="dashboard-content">

          {/* 🔹 Cards */}
          <div className="row mb-4 g-4">

            <div className="col-12 col-sm-6 col-lg-4">
              <div className="stat-card">
                <div className="stat-label">Total Ingresos</div>
                <div className="stat-value text-success">
                  {CambiarMoneda(totalIngresos)}
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4">
              <div className="stat-card">
                <div className="stat-label">Total Gastos</div>
                <div className="stat-value text-danger">
                  {CambiarMoneda(totalGastos)}
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="stat-card">
                <div className="stat-label">Balance</div>
                <div className={`stat-value ${balance >= 0 ? "text-success" : "text-danger"}`}>
                  {CambiarMoneda(balance)}
                </div>
              </div>
            </div>

          </div>

          {/* 🔹 Segunda fila */}
          <div className="row g-4">

            {/* 🔹 Gráfico */}
            <div className="col-12 col-lg-8">
              <div className="dashboard-card chart-box">

                <h5 className="chart-title text-center text-lg-start">
                  Ingresos vs Gastos
                </h5>

                <div className="chart-responsive">

                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataChart} barGap={8}>

                      <CartesianGrid strokeDasharray="3 3" vertical={false} />

                      <XAxis
                        dataKey="mes"
                        tick={{ fontSize: isMobile ? 10 : 13, fill: "#6c757d" }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        angle={isMobile ? -45 : -30}
                        textAnchor="end"
                        height={isMobile ? 70 : 60}
                      />

                      <YAxis
                        tick={{ fontSize: 12, fill: "#6c757d" }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        formatter={(value) =>
                          Number(value).toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP"
                          })
                        }
                      />

                      <Legend />

                      <Bar dataKey="Ingresos" fill="#198754" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="Gastos" fill="#dc3545" radius={[8, 8, 0, 0]} />

                    </BarChart>
                  </ResponsiveContainer>

                </div>
              </div>
            </div>

            {/* 🔹 Metas */}
            <div className="col-12 col-lg-4">
              <div className="dashboard-card">

                <h6 className="mb-4 text-center text-lg-start">
                  Metas de Ahorro
                </h6>

                <div className="progress-item mb-4">
                  <span>Fondo de Emergencia</span>
                  <div className="progress">
                    <div className="progress-bar bg-success" style={{ width: "85%" }}></div>
                  </div>
                </div>

                <div className="progress-item mb-4">
                  <span>Auto Nuevo</span>
                  <div className="progress">
                    <div className="progress-bar bg-success" style={{ width: "30%" }}></div>
                  </div>
                </div>

                <div className="progress-item">
                  <span>Vacaciones</span>
                  <div className="progress">
                    <div className="progress-bar bg-success" style={{ width: "55%" }}></div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}