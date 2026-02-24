import { useEffect, useState } from "react"
import { supabase } from "./supabaseclient"
import Formulario from "./formulario"

function Listado() {
  const [gastos, setGastos] = useState([])
  const [loading, setLoading] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [gastoAEliminar, setGastoAEliminar] = useState(null)
  const [gastoEditar, setGastoEditar] = useState(null)

  useEffect(() => {
    obtenerGastos()
  }, [])
const obtenerGastos = async () => {
    setLoading(true)
const { data, error } = await supabase
      .from("gastos")
      .select("*")
      .order("id", { ascending: false })

    if (!error) setGastos(data)

    setLoading(false)
  }

  const eliminarGasto = async () => {
    if (!gastoAEliminar) return
    await supabase
      .from("gastos")
      .delete()
      .eq("id", gastoAEliminar.id)
    setMostrarConfirmacion(false)
    setGastoAEliminar(null)
    obtenerGastos()
  }

  const CambiarMoneda = (numero) => {
    return numero.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP"
    })
  }

  return (
    <>
      <div className="card shadow p-4 mt-4">
        <h4 className="mb-4" style={{fontSize: 30, textAlign:"center"}}>Listado de Gastos</h4>
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-success"
            onClick={() => {
              setGastoEditar(null)
              setMostrarModal(true) }}   >
            Crear Gasto
          </button>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Valor</th>
                <th>Pagado</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map((gasto) => (
                <tr key={gasto.id}>
                  <td>{gasto.titulo}</td>
                  <td>{gasto.descripcion || "-"}</td>
                  <td>{CambiarMoneda(gasto.valor)}</td>
                  <td>
                    {gasto.pagado
                      ? <span className="badge bg-success">Sí</span>
                      : <span className="badge bg-danger">No</span>}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => {
                        setGastoEditar(gasto)
                        setMostrarModal(true)}}>
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        setGastoAEliminar(gasto)
                        setMostrarConfirmacion(true)}}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Formulario
        mostrar={mostrarModal}
        cerrar={() => {
          setMostrarModal(false)
          setGastoEditar(null)
        }}
        gastoEditar={gastoEditar}
        recargar={obtenerGastos}
      />

      {mostrarConfirmacion && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">

                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">
                    Confirmar Eliminación
                  </h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setMostrarConfirmacion(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  ¿Estás seguro que deseas eliminar el gasto
                  <strong> {gastoAEliminar?.titulo}</strong>?
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setMostrarConfirmacion(false)}>
                    Cancelar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={eliminarGasto}>
                    Sí, eliminar
                  </button>
                </div>

              </div>
            </div>
          </div>

          
        </>
      )}
    </>
  )
}

export default Listado