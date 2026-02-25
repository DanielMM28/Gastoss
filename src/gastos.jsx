import { useEffect, useState } from "react"
import { supabase } from "./supabaseclient"
import Formulario from "./formulario"

function Gastos() {
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
    await supabase
      .from("gastos")
      .delete()
      .eq("id", gastoAEliminar.id)

    setMostrarConfirmacion(false)
    obtenerGastos()
  }

  const totalGeneral = gastos.reduce(
    (acc, gasto) => acc + Number(gasto.valor),
    0
  )

  const CambiarMoneda = (numero) =>
    numero.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP"
    })

  return (
    <div className="card shadow-sm p-4 mb-5">
      <h4 className="text-center fw-bold mb-4">
        Listado de Gastos Anual
      </h4>

      <h5 className="text-primary text-center">
        Total: {CambiarMoneda(totalGeneral)}
      </h5>

      <div className="d-flex justify-content-end my-3">
        <button
          className="btn btn-success"
          onClick={() => {
            setGastoEditar(null)
            setMostrarModal(true)
          }}
        >
          Crear Gasto
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Título</th>
              <th>Valor</th>
              <th>Pagado</th>
            
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map(gasto => (
              <tr key={gasto.id}>
                <td>{gasto.titulo}</td>
                <td>{CambiarMoneda(gasto.valor)}</td>
                <td>
                  {gasto.pagado ? "Sí" : "No"}
                </td>
                
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => {
                      setGastoEditar(gasto)
                      setMostrarModal(true)
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setGastoAEliminar(gasto)
                      setMostrarConfirmacion(true)
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Formulario
        mostrar={mostrarModal}
        cerrar={() => setMostrarModal(false)}
        gastoEditar={gastoEditar}
        recargar={obtenerGastos}
      />
    </div>
  )
}

export default Gastos