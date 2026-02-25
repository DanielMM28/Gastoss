import { Routes, Route } from "react-router-dom"
import Listado from "./presupuesto/listado"
import Formulario from "./presupuesto/formularios/formulario"
import Tableros from "./presupuesto/tablero"
import ListadoIngresos from "./presupuesto/formularios/foringresos"
import Login from "./login"
import ProtectedRoute from "./protectedroutes"
import Dashboard from "./dashboard/dashboard"
import DashboardMensual from "./presupuesto/tablero"

function App() {
  return (
    <Routes>

      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/gastos-ingresos" element={
        <ProtectedRoute>
          <Listado />
        </ProtectedRoute>
      } />
      <Route path="/mensual" element={
        <ProtectedRoute>
          <DashboardMensual />
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