import { useEffect, useState } from "react"
import { supabase } from "./supabaseclient"

function DashboardMensual() {

  const [tableros, setTableros] = useState([])
  const [tableroId, setTableroId] = useState("")
  const [gastos, setGastos] = useState([])
  const [ingresos, setIngresos] = useState([])

  // 🔹 Cargar meses
  useEffect(() => {
    obtenerTableros()
    obtenerResumenAnual() // 👈 Cargar todo al inicio
  }, [])

  const obtenerTableros = async () => {
    const { data } = await supabase
      .from("tablero")
      .select("*")
      .order("tablero_id", { ascending: true })

    setTableros(data || [])
  }

  // 🔹 Cuando cambia el mes
  useEffect(() => {
    if (tableroId) {
      obtenerDatos(tableroId)
    } else {
      obtenerResumenAnual() // 👈 Si no hay mes seleccionado
    }
  }, [tableroId])

  // 🔹 Datos por mes
  const obtenerDatos = async (id) => {

    const { data: gastosData } = await supabase
      .from("gastos")
      .select("*")
      .eq("Tablero", id)

    const { data: ingresosData } = await supabase
      .from("ingresos")
      .select("*")
      .eq("Tablero", id)

    setGastos(gastosData || [])
    setIngresos(ingresosData || [])
  }

  // 🔹 Resumen anual (sin filtro)
  const obtenerResumenAnual = async () => {

    const { data: gastosData } = await supabase
      .from("gastos")
      .select("*")

    const { data: ingresosData } = await supabase
      .from("ingresos")
      .select("*")

    setGastos(gastosData || [])
    setIngresos(ingresosData || [])
  }

  const CambiarMoneda = (numero) =>
    numero.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP"
    })

  const totalGastos = gastos.reduce((acc, g) => acc + Number(g.valor), 0)
  const totalIngresos = ingresos.reduce((acc, i) => acc + Number(i.valor), 0)
  const balance = totalIngresos - totalGastos

  return (
    <div className="card shadow-sm p-4" >

      <h3 className="mb-4">
        {tableroId ? "Resumen del Mes" : "Resumen General del Año"}
      </h3>

      {/* 🔽 SELECTOR */}
      <div className="mb-4">
        <label className="form-label fw-bold">Seleccionar Mes</label>
        <select
          className="form-select"
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

      {/* 🔹 Tarjetas resumen */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card p-3 shadow-sm">
            <h6>Total Ingresos</h6>
            <h4 className="text-success">{CambiarMoneda(totalIngresos)}</h4>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card p-3 shadow-sm">
            <h6>Total Gastos</h6>
            <h4 className="text-danger">{CambiarMoneda(totalGastos)}</h4>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card p-3 shadow-sm">
            <h6>Balance</h6>
            <h4 className={balance >= 0 ? "text-success" : "text-danger"}>
              {CambiarMoneda(balance)}
            </h4>
          </div>
        </div>
      </div>

      {/* 🔹 Listados */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <h5>Gastos</h5>
          <ul className="list-group">
            {gastos.map(g => (
              <li key={g.id} className="list-group-item d-flex justify-content-between">
                {g.titulo}
                <span className="text-danger">
                  {CambiarMoneda(g.valor)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-6 mb-4">
          <h5>Ingresos</h5>
          <ul className="list-group">
            {ingresos.map(i => (
              <li key={i.id} className="list-group-item d-flex justify-content-between">
                {i.Titulo}
                <span className="text-success">
                  {CambiarMoneda(i.valor)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  )
}

export default DashboardMensual