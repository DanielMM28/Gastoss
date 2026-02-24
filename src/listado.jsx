import { useEffect, useState } from "react"
import { supabase } from "./supabaseclient"
import Formulario from "./formulario"
import "./listado.css"

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


  const totalGeneral = gastos.reduce(
    (acc, gasto) => acc + Number(gasto.valor),
    0
  )

  const totalPagado = gastos
    .filter(g => g.pagado)
    .reduce((acc, gasto) => acc + Number(gasto.valor), 0)

  const totalPendiente = gastos
    .filter(g => !g.pagado)
    .reduce((acc, gasto) => acc + Number(gasto.valor), 0)

  const CambiarMoneda = (numero) => {
    return numero.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP"
    })
  }

return (
  <>
    <div className="container py-4">
      <div className="card shadow-sm p-3 p-md-4">

        <h4 className="text-center mb-4 fw-bold">
          Listado de Gastos
        </h4>

        {/* ================= TARJETAS RESPONSIVE ================= */}
        <div className="row g-3 mb-4">

          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card resumen-card border-0 shadow-sm h-100 text-center">
              <div className="card-body">
                <h6 className="text-muted small">Total General</h6>
                <h5 className="fw-bold text-primary">
                  {CambiarMoneda(totalGeneral)}
                </h5>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card resumen-card border-0 shadow-sm h-100 text-center">
              <div className="card-body">
                <h6 className="text-muted small">Total Pagado</h6>
                <h5 className="fw-bold text-success">
                  {CambiarMoneda(totalPagado)}
                </h5>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card resumen-card border-0 shadow-sm h-100 text-center">
              <div className="card-body">
                <h6 className="text-muted small">Total Pendiente</h6>
                <h5 className="fw-bold text-danger">
                  {CambiarMoneda(totalPendiente)}
                </h5>
              </div>
            </div>
          </div>

        </div>

        {/* ================= BOTÓN RESPONSIVE ================= */}
        <div className="d-flex justify-content-center justify-content-md-end mb-3">
          <button
            className="btn btn-success w-100 w-md-auto"
            onClick={() => {
              setGastoEditar(null)
              setMostrarModal(true)
            }}
          >
            Crear Gasto
          </button>
        </div>

        {/* ================= TABLA RESPONSIVE ================= */}
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle text-nowrap">
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
                    <td className="text-truncate" style={{maxWidth: "150px"}}>
                      {gasto.descripcion || "-"}
                    </td>
                    <td>{CambiarMoneda(gasto.valor)}</td>
                    <td>
                      {gasto.pagado ? (
                        <span className="badge bg-success">Sí</span>
                      ) : (
                        <span className="badge bg-danger">No</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex flex-column flex-md-row gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setGastoEditar(gasto)
                            setMostrarModal(true)
                          }}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            setGastoAEliminar(gasto)
                            setMostrarConfirmacion(true)
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
                    onClick={() => setMostrarConfirmacion(false)}
                  >
                    Cancelar
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={eliminarGasto}
                  >
                    Sí, eliminar
                  </button>
                </div>

              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  )
}

export default Listado