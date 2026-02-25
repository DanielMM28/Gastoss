import Gastos from "./gastos"
import Ingresos from "./ingresoss"
import DashboardMensual from "./tablero"

function Listado() {
  return (
    <div className="container-fluid px-3 px-md-5 py-4">

      <h2 className="text-center mb-4 fw-bold">
        Mi Presupuesto Mensual
      </h2>

   
      <div className="mb-4">
        <DashboardMensual />
      </div>


      <div className="row g-4">

        <div className="col-12 col-lg-6">
          <Gastos />
        </div>

        <div className="col-12 col-lg-6">
          <Ingresos />
        </div>

      </div>

    </div>
  )
}

export default Listado