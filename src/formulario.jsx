import { useState, useEffect } from "react"
import { supabase } from "./supabaseclient"

function Formulario({ mostrar, cerrar, gastoEditar, recargar }) {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [valor, setValor] = useState("")
  const [pagado, setPagado] = useState(false)
  const [fecha, setFecha] = useState("")

  useEffect(() => {
    if (gastoEditar) {
      setTitulo(gastoEditar.titulo)
      setDescripcion(gastoEditar.descripcion)
      setValor(gastoEditar.valor)
      setPagado(gastoEditar.pagado)
      setFecha(gastoEditar.fecha)
    }
  }, [gastoEditar])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!titulo || !valor || !fecha) return

    if (gastoEditar) {
      await supabase
        .from("gastos")
        .update({ titulo, descripcion, valor, pagado, fecha })
        .eq("id", gastoEditar.id)
    } else {
      await supabase
        .from("gastos")
        .insert([{ titulo, descripcion, valor, pagado, fecha }])
    }

    cerrar()
    recargar()
  }

  if (!mostrar) return null

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">
                {gastoEditar ? "Editar Gasto" : "Nuevo Gasto"}
              </h5>
              <button className="btn-close" onClick={cerrar}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />

                <textarea
                  className="form-control mb-3"
                  placeholder="Descripción"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />

                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Valor"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  required
                />

                <input
                  type="date"
                  className="form-control mb-3"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />

                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={pagado}
                    onChange={(e) => setPagado(e.target.checked)}
                  />
                  <label className="form-check-label">
                    Pagado
                  </label>
                </div>

              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cerrar}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Guardar
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  )
}

export default Formulario