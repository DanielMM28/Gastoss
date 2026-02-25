import { useState } from "react"
import Gastos from "./gastos"
import Ingresos from "./ingresoss"
import Sidebar from "../componentes/sidebar"
import Navbar from "../componentes/navbar"
import "../dashboard/dashboard.css"

function Listado() {

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Sección principal */}
      <div className="main-section">

        <Navbar toggleSidebar={toggleSidebar} />

        <div className="dashboard-content">

          <div className="row g-4">

            <div className="col-12 col-lg-6">
              <Gastos />
            </div>

            <div className="col-12 col-lg-6">
              <Ingresos />
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}

export default Listado