import { useEffect, useState } from "react"
import { supabase } from "../supabaseclient"
import FormularioIngresos from "./formularios/foringresos"
import "./gastos.css"

function Ingresos() {
  const [ingresos, setIngresos] = useState([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [ingresoEditar, setIngresoEditar] = useState(null)

  // 🔹 NUEVO
  const [paginaActual, setPaginaActual] = useState(1)
  const ingresosPorPagina = 5

  useEffect(() => {
    obtenerIngresos()
  }, [])

  const obtenerIngresos = async () => {
    const { data, error } = await supabase
      .from("ingresos")
      .select(`
        *,
        tableros:tablero (Descripcion)
      `)
      .order("id", { ascending: false })

    if (!error) setIngresos(data || [])
  }

  const eliminarIngreso = async (id) => {
    await supabase
      .from("ingresos")
      .delete()
      .eq("id", id)

    obtenerIngresos()
  }

  const abrirCrear = () => {
    setIngresoEditar(null)
    setMostrarModal(true)
  }

  const abrirEditar = (ingreso) => {
    setIngresoEditar(ingreso)
    setMostrarModal(true)
  }

  const totalIngresos = ingresos.reduce(
    (acc, ingreso) => acc + Number(ingreso.valor || 0),
    0
  )

  const formatoMoneda = (numero = 0) =>
    Number(numero).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP"
    })

  // ==============================
  // 🔹 Lógica de paginación
  // ==============================
  const indiceFinal = paginaActual * ingresosPorPagina
  const indiceInicial = indiceFinal - ingresosPorPagina
  const ingresosActuales = ingresos.slice(indiceInicial, indiceFinal)
  const totalPaginas = Math.ceil(ingresos.length / ingresosPorPagina)

  return (
    <>
      <div className="modern-card">

        <div className="card-header-modern">
          <div>
            <h4>Ingresos Anuales</h4>
            <p className="subtitle">
              Total: <span className="total-amount ">
                {formatoMoneda(totalIngresos)}
              </span>
            </p>
          </div>

          <button
            className="btn-create"
            onClick={abrirCrear}
            style={{backgroundColor:"#18A874"}}
          >
            + Nuevo ingreso
          </button>
        </div>

        <div className="table-modern">
          <table>
            <thead>
  <tr>
    <th>Título</th>
    
    <th>Valor</th>
    <th>Mes</th>   {/* NUEVO */}
    <th></th>
  </tr>
</thead>
            <tbody>
              {ingresosActuales.map(ingreso => (
                <tr key={ingreso.id}>
                  <td>{ingreso.Titulo}</td>
                  <td className="valor ">
                    {formatoMoneda(ingreso.valor)}
                  </td>
                  <td>{ingreso.tableros?.Descripcion}</td>
                  <td className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => abrirEditar(ingreso)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => eliminarIngreso(ingreso.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔹 PAGINACIÓN */}
        <div className="pagination-container">

          <button
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(paginaActual - 1)}
          >
            Anterior
          </button>

          <span>
            Página {paginaActual} de {totalPaginas || 1}
          </span>

          <button
            disabled={paginaActual === totalPaginas || totalPaginas === 0}
            onClick={() => setPaginaActual(paginaActual + 1)}
          >
            Siguiente
          </button>

        </div>

      </div>

      <FormularioIngresos
        mostrar={mostrarModal}
        cerrar={() => setMostrarModal(false)}
        ingresoEditar={ingresoEditar}
        recargar={obtenerIngresos}
      />
    </>
  )
}

export default Ingresos