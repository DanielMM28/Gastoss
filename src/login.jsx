import { useState } from "react"
import { supabase } from "./supabaseclient"
import { useNavigate } from "react-router-dom"

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
    <div className="container py-5" style={{maxWidth:"400px"}}>
      <h3 className="text-center mb-4">Iniciar Sesión</h3>

      <input
        type="email"
        className="form-control mb-3"
        placeholder="Correo"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Contraseña"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button onClick={login} className="btn btn-dark w-100">
        Entrar
      </button>
    </div>
  )
}

export default Login