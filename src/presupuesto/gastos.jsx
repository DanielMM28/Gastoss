import { useEffect, useState } from "react"
import { supabase } from "../supabaseclient"
import Formulario from "./formularios/formulario"
import "./gastos.css"

function Gastos() {
  const [gastos, setGastos] = useState([])
  const [loading, setLoading] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [gastoAEliminar, setGastoAEliminar] = useState(null)
  const [gastoEditar, setGastoEditar] = useState(null)

  // 🔹 NUEVO
  const [paginaActual, setPaginaActual] = useState(1)
  const gastosPorPagina = 5

  useEffect(() => {
    obtenerGastos()
  }, [])

  const obtenerGastos = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("gastos")
      .select(`
        *,
        tableros:tablero (Descripcion)
      `)
      .order("id", { ascending: false })

    if (!error) setGastos(data || [])

    setLoading(false)
  }

 const eliminarGasto = async () => {

  if (!gastoAEliminar) return

  console.log("Eliminando:", gastoAEliminar)

  const { error } = await supabase
    .from("gastos")
    .delete()
    .eq("id", gastoAEliminar.id)

  if (error) {
    console.error("Error eliminando:", error)
  }

  setMostrarConfirmacion(false)
  obtenerGastos()
}

  const totalGeneral = gastos.reduce(
    (acc, gasto) => acc + Number(gasto.valor || 0),
    0
  )

  const CambiarMoneda = (numero = 0) =>
    Number(numero).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP"
    })

  // ==============================
  // 🔹 Lógica de paginación
  // ==============================
  const indiceFinal = paginaActual * gastosPorPagina
  const indiceInicial = indiceFinal - gastosPorPagina
  const gastosActuales = gastos.slice(indiceInicial, indiceFinal)
  const totalPaginas = Math.ceil(gastos.length / gastosPorPagina)

  return (
    <div className="modern-card">

      <div className="card-header-modern">
        <div>
          <h4>Gastos Anuales</h4>
          <p className="subtitle">
            Total: <span className="total-amount">
              {CambiarMoneda(totalGeneral)}
            </span>
          </p>
        </div>

        <button
          className="btn-create"
          style={{backgroundColor:"#18A874"}}
          onClick={() => {
            setGastoEditar(null)
            setMostrarModal(true)
          }}
        >
          + Nuevo gasto
        </button>
      </div>

      <div className="table-modern">
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Valor</th>
              <th>Pagado</th>
              <th>Mes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {gastosActuales.map(gasto => (
              <tr key={gasto.id}>
                <td>{gasto.titulo}</td>
                <td className="valor">{CambiarMoneda(gasto.valor)}</td>
                <td>
                  <span className={`badge-status ${gasto.pagado ? "paid" : "pending"}`}>
                    {gasto.pagado ? "Pagado" : "Pendiente"}
                  </span>
                </td>
                <td>{gasto.tableros?.Descripcion}</td>
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setGastoEditar(gasto)
                      setMostrarModal(true)
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
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

      {/* 🔹 CONTROLES DE PAGINACIÓN */}
      <div className="pagination-container">

        <button
          disabled={paginaActual === 1}
          onClick={() => setPaginaActual(paginaActual - 1)}
        >
          Anterior
        </button>

        <span>
          Página {paginaActual} de {totalPaginas}
        </span>

        <button
          disabled={paginaActual === totalPaginas}
          onClick={() => setPaginaActual(paginaActual + 1)}
        >
          Siguiente
        </button>

      </div>

      <Formulario
        mostrar={mostrarModal}
        cerrar={() => setMostrarModal(false)}
        gastoEditar={gastoEditar}
        recargar={obtenerGastos}
      />
      {/* 🔴 MODAL CONFIRMACIÓN ELIMINAR */}
{mostrarConfirmacion && (
  <div className="modal-overlay">
    <div className="modal-confirm">

      <h5>¿Eliminar gasto?</h5>

      <p>
        Estás a punto de eliminar 
        <strong> {gastoAEliminar?.titulo} </strong>
      </p>

      <div className="modal-buttons">
        <button
          className="btn-cancel"
          onClick={() => setMostrarConfirmacion(false)}
        >
          Cancelar
        </button>

        <button
          className="btn-confirm-delete"
          onClick={eliminarGasto}
        >
          Sí, eliminar
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  )
}

export default Gastos