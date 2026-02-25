import { useState } from "react"
import { supabase } from "./supabaseclient"

function Auth() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const registrar = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Usuario registrado ✅")
    }
  }

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Sesión iniciada 🔥")
      window.location.reload()
    }
  }

  return (
    <div className="container py-5" style={{maxWidth:"400px"}}>
      <h3 className="mb-4 text-center">Iniciar Sesión</h3>

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

      <button onClick={login} className="btn btn-dark w-100 mb-2">
        Iniciar Sesión
      </button>

      <button onClick={registrar} className="btn btn-outline-dark w-100">
        Registrarse
      </button>
    </div>
  )
}

export default Auth