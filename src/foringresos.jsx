import { useState, useEffect } from "react"
import { supabase } from "./supabaseclient"

function FormularioIngresos({ mostrar, cerrar, ingresoEditar, recargar }) {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [valor, setValor] = useState("")
  const [tableros, setTableros] = useState([])
  const [tableroId, setTableroId] = useState("")

  useEffect(() => {
    const obtenerTableros = async () => {
      const { data } = await supabase
        .from("tablero")
        .select("*")
        .order("tablero_id", { ascending: true })

      setTableros(data || [])
    }

    obtenerTableros()
  }, [])

  useEffect(() => {
    if (ingresoEditar) {
      setTitulo(ingresoEditar.Titulo || "")
      setDescripcion(ingresoEditar.descripcion || "")
      setValor(ingresoEditar.valor || "")
      setTableroId(ingresoEditar.Tablero || "")
    } else {
      limpiarFormulario()
    }
  }, [ingresoEditar])

  const limpiarFormulario = () => {
    setTitulo("")
    setDescripcion("")
    setValor("")
    setTableroId("")
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (!titulo || !valor || !tableroId) {
    alert("Completa todos los campos")
    return
  }

  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  if (!user) {
    alert("No hay usuario autenticado")
    return
  }

  const dataIngreso = {
    Titulo: titulo,
    descripcion,
    valor: Number(valor),
    Tablero: Number(tableroId),
    user_id: user.id   // 🔥 MUY IMPORTANTE
  }

  let response

  if (ingresoEditar) {
    response = await supabase
      .from("ingresos")
      .update(dataIngreso)
      .eq("id", ingresoEditar.id)
  } else {
    response = await supabase
      .from("ingresos")
      .insert([dataIngreso])
  }

  if (response.error) {
    console.error(response.error)
    alert("Error: " + response.error.message)
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

            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">
                {ingresoEditar ? "Editar Ingreso" : "Nuevo Ingreso"}
              </h5>
              <button className="btn-close btn-close-white" onClick={cerrar}></button>
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
                      {tablero.Descripcion}
                    </option>
                  ))}
                </select>

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

export default FormularioIngresos