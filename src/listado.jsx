import { useState } from "react"
import Gastos from "./gastos"
import Ingresos from "./ingresoss"
import DashboardMensual from "./tablero"

function Listado() {
  const [mostrarGastos, setMostrarGastos] = useState(true)
  const [mostrarIngresos, setMostrarIngresos] = useState(true)

  return (
    <div className="container-fluid px-3 px-md-5 py-4">

      <h2 className="text-center mb-4 fw-bold">
        Mi Presupuesto Personal
      </h2>

      <div className="mb-4">
        <DashboardMensual />
      </div>

      <div className="d-flex justify-content-center gap-3 mb-4">
        <button 
          className="btn btn-outline-primary"
          onClick={() => setMostrarGastos(!mostrarGastos)}
        >
          {mostrarGastos ? "Ocultar Gastos Anuales" : "Mostrar Gastos Anuales"}
        </button>

        <button 
          className="btn btn-outline-success"
          onClick={() => setMostrarIngresos(!mostrarIngresos)}
        >
          {mostrarIngresos ? "Ocultar Ingresos Anuales" : "Mostrar Ingresos Anuales"}
        </button>
      </div>

      <div className="row g-4">
        {mostrarGastos && (
          <div className="col-12 col-lg-6">
            <Gastos />
          </div>
        )}

        {mostrarIngresos && (
          <div className="col-12 col-lg-6">
            <Ingresos />
          </div>
        )}
      </div>

    </div>
  )
}

export default Listado
