import { useEffect, useState } from "react"
import { supabase } from "./supabaseclient"
import FormularioIngresos from "./foringresos"

function Ingresos() {
  const [ingresos, setIngresos] = useState([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [ingresoEditar, setIngresoEditar] = useState(null)

  useEffect(() => {
    obtenerIngresos()
  }, [])

  const obtenerIngresos = async () => {
    const { data, error } = await supabase
      .from("ingresos")
      .select("*")
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
    (acc, ingreso) => acc + Number(ingreso.valor),
    0
  )

  const formatoMoneda = (numero) =>
    numero.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP"
    })

  return (
    <>
      <div className="card shadow-sm p-4">
        <h4 className="text-center fw-bold mb-4">
          Listado de Ingresos
        </h4>

        <h5 className="text-success text-center">
          Total: {formatoMoneda(totalIngresos)}
        </h5>

        <div className="d-flex justify-content-end my-3">
          <button
            className="btn btn-success"
            onClick={abrirCrear}
          >
            Crear Ingreso
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Título</th>
                <th>Valor</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {ingresos.map(ingreso => (
                <tr key={ingreso.id}>
                  <td>{ingreso.Titulo}</td>
                  <td>{formatoMoneda(ingreso.valor)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => abrirEditar(ingreso)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
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