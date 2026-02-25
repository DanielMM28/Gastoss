import { useState } from "react"
import { supabase } from "./supabaseclient"
import { useNavigate } from "react-router-dom"
import "./login.css"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
    } else {
      navigate("/")
    }
  }

  return (
    <div className="login-wrapper">

      <div className="login-card">

        <div className="login-header">
         
          <h3>Forgastos</h3>
          <p>Gestiona tus finanzas con control y claridad</p>
        </div>

        <div className="login-form">

          <input
            type="email"
            placeholder="Correo electrónico"
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button onClick={login}>
            Iniciar Sesión
          </button>

        </div>

      </div>

    </div>
  )
}

export default Login