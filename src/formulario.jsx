import { useState } from "react"
import { supabase } from "./supabaseclient"

function Formulario({ mostrar, cerrar }) {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [valor, setValor] = useState("")
  const [pagado, setPagado] = useState(false)
  const [fecha, setFecha] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!titulo || !valor || !fecha) {
      alert("Campos obligatorios faltantes")
      return
    }

    const { error } = await supabase
      .from("gastos")
      .insert([
        { titulo, descripcion, valor: Number(valor), pagado, fecha }
      ])

    if (error) {
      console.error(error)
      alert("Error al guardar")
    } else {
      limpiarFormulario()
      cerrar() // 👈 cerrar modal
    }
  }

  const limpiarFormulario = () => {
    setTitulo("")
    setDescripcion("")
    setValor("")
    setPagado(false)
    setFecha("")
  }

  if (!mostrar) return null

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      
      <div className="modal-dialog">
        
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Registrar Gasto</h5>
            <button type="button" className="btn-close" onClick={cerrar}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">

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
                <label className="form-label">Fecha *</label>
                <input
                  type="date"
                  className="form-control"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={pagado}
                  onChange={(e) => setPagado(e.target.checked)}
                />
                <label className="form-check-label">Pagado</label>
              </div>

            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cerrar}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Formulario