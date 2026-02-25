import { useState, useEffect } from "react"
import { supabase } from "./supabaseclient"

function Formulario({ mostrar, cerrar, gastoEditar, recargar }) {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [valor, setValor] = useState("")
  const [pagado, setPagado] = useState(false)
  const [fecha, setFecha] = useState("")
  const [tableros, setTableros] = useState([])
  const [tableroId, setTableroId] = useState("")

  // 🔹 Cargar meses (tabla tablero)
  useEffect(() => {
    const obtenerTableros = async () => {
      const { data, error } = await supabase
        .from("tablero")
        .select("*")

      if (error) {
        console.error("Error cargando tableros:", error.message)
      } else {
        console.log("Tableros cargados:", data)
        setTableros(data)
      }
    }

    obtenerTableros()
  }, [])

  // 🔹 Si estoy editando
  useEffect(() => {
    if (gastoEditar) {
      setTitulo(gastoEditar.titulo || "")
      setDescripcion(gastoEditar.descripcion || "")
      setValor(gastoEditar.valor || "")
      setPagado(gastoEditar.pagado || false)
      setFecha(gastoEditar.fecha || "")
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
    setFecha("")
    setTableroId("")
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (!titulo || !valor || !fecha || !tableroId) {
    alert("Completa todos los campos obligatorios")
    return
  }

  // 🔥 Obtener usuario actual
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData?.user?.id

  if (!userId) {
    alert("No hay usuario autenticado")
    return
  }

  if (gastoEditar) {

    // 🔹 ACTUALIZAR
    const { error } = await supabase
      .from("gastos")
      .update({
        titulo,
        descripcion,
        valor: Number(valor),
        pagado,
        fecha,
        Tablero: Number(tableroId),
        user_id: userId // 🔥 importante
      })
      .eq("id", gastoEditar.id)

    if (error) {
      console.error("Error actualizando:", error.message)
      return
    }

  } else {

    // 🔹 INSERTAR
    const { error } = await supabase
      .from("gastos")
      .insert([
        {
          titulo,
          descripcion,
          valor: Number(valor),
          pagado,
          fecha,
          Tablero: Number(tableroId),
          user_id: userId // 🔥 AQUÍ está lo importante
        }
      ])

    if (error) {
      console.error("Error insertando:", error.message)
      return
    }
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

                

                {/* 🔹 SELECT MESES */}
                <div className="mb-3">
                  <label className="form-label">Mes</label>
                  <select
                    className="form-select"
                    value={tableroId}
                    onChange={(e) => setTableroId(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar mes</option>

                    {tableros.map((tablero) => (
                      <option
                        key={tablero.tablero_id}
                        value={tablero.tablero_id}
                      >
                        {tablero.Descripcion || tablero.descripcion}
                      </option>
                    ))}

                  </select>
                </div>

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