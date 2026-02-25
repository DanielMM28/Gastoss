import { Routes, Route } from "react-router-dom"
import Listado from "./listado"
import Formulario from "./formulario"
import Tableros from "./tablero"
import ListadoIngresos from "./foringresos"
import Login from "./login"
import ProtectedRoute from "./protectedroutes"

function App() {
  return (
    <Routes>

      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route path="/" element={
        <ProtectedRoute>
          <Listado />
        </ProtectedRoute>
      } />

      <Route path="/tablero/:id" element={
        <ProtectedRoute>
          <Tableros />
        </ProtectedRoute>
      } />

      <Route path="/crear" element={
        <ProtectedRoute>
          <Formulario />
        </ProtectedRoute>
      } />

      <Route path="/editar/:id" element={
        <ProtectedRoute>
          <Formulario />
        </ProtectedRoute>
      } />

      <Route path="/ingresos/:id" element={
        <ProtectedRoute>
          <ListadoIngresos />
        </ProtectedRoute>
      } />

    </Routes>
  )
}

export default App