import { useState } from "react"
import { supabase } from "./supabaseclient"

function Formulario() {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [valor, setValor] = useState("")
  const [pagado, setPagado] = useState(false)
    const [fecha, setFecha] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!titulo || !valor) {
      alert("Título y Valor son obligatorios")
      return
    }

 const { error } = await supabase
  .schema("public")
  .from("gastos")
  .insert([
    { titulo, descripcion, valor: Number(valor), pagado, fecha }
  ])

    if (error) {
      console.error(error)
      alert("Error al guardar")
    } else {
      alert("Gasto guardado correctamente ✅")
      limpiarFormulario()
    }
  }

  const limpiarFormulario = () => {
    setTitulo("")
    setDescripcion("")
    setValor("")
    setPagado(false)
  }

  return (
    <div className="container mt-4">

      <div className="card shadow p-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h3 className="text-center mb-4">
          Registro de Gasto
        </h3>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Título *</label>
            <input
              type="text"
              className="form-control"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Valor *</label>
            <input
              type="number"
              className="form-control"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">fecha *</label>
            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              checked={pagado}
              onChange={(e) => setPagado(e.target.checked)}
            />
            <label className="form-check-label">Pagado</label>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Guardar
          </button>

        </form>
      </div>

    </div>
  )
}

export default Formulario