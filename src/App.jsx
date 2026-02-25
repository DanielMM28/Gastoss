import { Routes, Route } from "react-router-dom"
import Listado from "./listado"
import Formulario from "./formulario"
import Tableros from "./tablero"
import ListadoIngresos from "./foringresos"


function App() {
  return (
   <Routes>
  <Route path="/" element={<Listado />} />
  <Route path="/tablero/:id" element={<Tableros />} />
  <Route path="/crear" element={<Formulario />} />

  <Route path="/editar/:id" element={<Formulario />} />
  <Route path="/ingresos/:id" element={<ListadoIngresos />} />
    
</Routes>
  )
}

export default App