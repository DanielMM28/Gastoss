import { useState, useEffect } from "react"
import { supabase } from "../../supabaseclient"
import "../../App.css"

function Formulario({ mostrar, cerrar, gastoEditar, recargar }) {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [valor, setValor] = useState("")
  const [pagado, setPagado] = useState(false)
  const [tableros, setTableros] = useState([])
  const [tableroId, setTableroId] = useState("")

  // ==========================
  // 🔹 Obtener meses (tableros)
  // ==========================
  useEffect(() => {
    const obtenerTableros = async () => {
      const { data, error } = await supabase
        .from("tablero")
        .select("*")
        .order("tablero_id", { ascending: true })

      if (error) {
        console.error("Error cargando tableros:", error.message)
      } else {
        setTableros(data || [])
      }
    }

    obtenerTableros()
  }, [])

  // ==========================
  // 🔹 Cargar datos al editar
  // ==========================
  useEffect(() => {
    if (gastoEditar) {
      setTitulo(gastoEditar.titulo || "")
      setDescripcion(gastoEditar.descripcion || "")
      setValor(gastoEditar.valor || "")
      setPagado(gastoEditar.pagado || false)
      setTableroId(gastoEditar.Tablero || "")
    } else {
      limpiarFormulario()
    }
  }, [gastoEditar])

  const limpiarFormulario = () => {
    setTitulo("")
    setDescripcion("")
    setValor("")
    setPagado(false)
    setTableroId("")
  }

  // ==========================
  // 🔹 Guardar
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!titulo || !valor || !tableroId) {
      alert("Completa todos los campos obligatorios")
      return
    }

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id

    if (!userId) {
      alert("No hay usuario autenticado")
      return
    }

    const dataGasto = {
      titulo,
      descripcion,
      valor: Number(valor),
      pagado,
      Tablero: Number(tableroId), // 👈 guardar mes seleccionado
      user_id: userId
    }

    let error
    if (gastoEditar) {
      const res = await supabase
        .from("gastos")
        .update(dataGasto)
        .eq("id", gastoEditar.id)
      error = res.error
    } else {
      const res = await supabase
        .from("gastos")
        .insert([dataGasto])
      error = res.error
    }

    if (error) {
      console.error("Error guardando:", error.message)
      return
    }

    limpiarFormulario()
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

                {/* 🔹 SELECT DE MES */}
                <select
                  className="form-select mb-3"
                  value={tableroId}
                  onChange={(e) => setTableroId(e.target.value)}
                  required
                >
                  <option value="">Seleccionar Mes</option>

                  {tableros.map((tablero) => (
                    <option
                      key={tablero.tablero_id}
                      value={tablero.tablero_id}
                    >
                      {tablero.Descripcion}
                    </option>
                  ))}
                </select>

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
                  className="btn btn-success"
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