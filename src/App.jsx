import { Routes, Route } from "react-router-dom"
import Listado from "./listado"
import Formulario from "./formulario"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Listado />} />
      <Route path="/crear" element={<Formulario />} />
    </Routes>
  )
}

export default App