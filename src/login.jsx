import { useState } from "react"
import { supabase } from "./supabaseclient"
import { useNavigate } from "react-router-dom"
import "./login.css"
import { FiUser } from "react-icons/fi"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const navigate = useNavigate()

  const handleAuth = async () => {

    if (isRegistering) {
      // 🔹 REGISTRAR USUARIO
      const { error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        alert(error.message)
      } else {
        alert("Usuario creado correctamente ✅")
      }

    } else {
      // 🔹 INICIAR SESIÓN
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
  }

  return (
  <div className="login-wrapper">

    <div className="login-card">

      <div className="login-header">
        <div className="login-logo">
          <FiUser size={20} />
        </div>

        <h2>
          {isRegistering ? "Crear cuenta" : "Bienvenido"}
        </h2>

        <p>
          {isRegistering
            ? "Crea tu cuenta para continuar"
            : "Inicia sesión en tu cuenta"}
        </p>
      </div>

      <div className="login-form">

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button onClick={handleAuth}>
          {isRegistering ? "Crear Cuenta" : "Entrar"}
        </button>

      </div>

      <div className="login-footer">
        <span onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </span>
      </div>

    </div>

  </div>
)
}

export default Login