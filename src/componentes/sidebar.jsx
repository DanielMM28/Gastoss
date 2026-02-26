import { House, Wallet, BarChart2, PiggyBank, Settings, X } from "lucide-react"
import "./sidebar.css"
import { NavLink } from "react-router-dom"


export default function Sidebar({ isOpen, toggleSidebar }) {

  return (
    <>
      {/* Overlay oscuro en móvil */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>

        {/* Botón cerrar en móvil */}
        <div className="sidebar-header">
          <div>
            <div className="sidebar-logo">
  <div className="logo-icon">
    <PiggyBank size={22} />
  </div>

  <div className="logo-text">
    <h4>Forgastos</h4>
    <small styl>Asistente financiero</small>
  </div>
</div>
          </div>

          <button className="close-btn" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>
<br />
        <nav>
          <ul>

            <li>
              <NavLink
                to="/"
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  isActive ? "sidebar-item active" : "sidebar-item"
                }
              >
                <House size={18} />
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/mensual"
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  isActive ? "sidebar-item active" : "sidebar-item"
                }
              >
                <BarChart2 size={18} />
                <span>Resumen</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/gastos-ingresos"
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  isActive ? "sidebar-item active" : "sidebar-item"
                }
              >
                <Wallet size={18} />
                <span>Gastos e ingresos</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/ahorros"
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  isActive ? "sidebar-item active" : "sidebar-item"
                }
              >
                <PiggyBank size={18} />
                <span>Ahorros</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/configuracion"
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  isActive ? "sidebar-item active" : "sidebar-item"
                }
              >
                <Settings size={18} />
                <span>Configuración</span>
              </NavLink>
            </li>

          </ul>
        </nav>

      </aside>
    </>
  )
}