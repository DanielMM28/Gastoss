import { useEffect, useState } from "react"
import { supabase } from "./supabaseclient"
import Formulario from "./formulario"

function Listado() {
  const [gastos, setGastos] = useState([])
  const [loading, setLoading] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)

  useEffect(() => {
    obtenerGastos()
  }, [])

  const obtenerGastos = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("gastos")
      .select("*")
      .order("id", { ascending: false })

    if (!error) {
      setGastos(data)
    }

    setLoading(false)
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

        

        <h4 className="mb-3">Listado de Gastos</h4>
 <button
          className="btn btn-primary "
          onClick={() => setMostrarModal(true)}
          style={{textAlign : "center", marginBottom: "20px", marginLeft: "85%"}}
        >
          Crear Gasto
        </button>
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
                      <button className="btn btn-sm btn-outline-primary me-2">
                        Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
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
          obtenerGastos() 
        }}
      />
    </>
  )
}

export default Listado