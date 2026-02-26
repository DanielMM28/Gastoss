import { Bell, Search, Menu } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { supabase } from "../supabaseclient"
import { useNavigate } from "react-router-dom"
import "./navbar.css"
import { FiUser } from "react-icons/fi"
export default function Navbar({ toggleSidebar }) {

  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Detectar tamaño pantalla
useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768)
  }

  const getUser = async () => {
    const { data } = await supabase.auth.getUser()
    console.log(data?.user?.email)
  }

  getUser()

  window.addEventListener("resize", handleResize)
  return () => window.removeEventListener("resize", handleResize)
}, [])

  // Cerrar dropdown si hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Cerrar sesión
  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }
  

  return (
    <div className="navbar">

      {/* 🔹 Izquierda */}
      <div className="navbar-left">

        {isMobile && (
          <button className="icon-btn me-2" onClick={toggleSidebar}>
            <Menu size={20} />
          </button>
        )}

        <div>
          <h5 className="mb-0 fw-bold navbar-title">
            Bienvenido
          </h5>
          {!isMobile && (
            <small className="text-muted" style={{marginLeft:"20px"}}>
              Aquí tienes el resumen de tus finanzas este mes
            </small>
          )}
        </div>
      </div>

      {/* 🔹 Derecha */}
      <div className="navbar-actions">

      

        <button className="icon-btn">
          <Bell size={18} />
        </button>

        {/* Avatar */}
        <div className="user-container" ref={dropdownRef}>
          <div
            className="user-avatar"
            onClick={() => setOpen(!open)}
          >
           <FiUser size={20} />
          </div>

          {open && (
            <div className="dropdown-menu-custom">
              <button onClick={cerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}