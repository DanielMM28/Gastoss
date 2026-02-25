import { useEffect, useState } from "react"
import { supabase } from "./supabaseclient"
import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    // Obtener sesión actual
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // 👇 Escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }

  }, [])

  if (loading) return <div>Cargando...</div>

  return session ? children : <Navigate to="/login" />
}

export default ProtectedRoute