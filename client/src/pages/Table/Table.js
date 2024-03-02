import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Row, TableData, Wrapper } from "./styles"
import { showMixedProject } from "../../services/mixed-project-service"
import { formatDateToString } from "../../utils"
import Loader from "../../components/Loader/Loader"
import { useAuth } from "../../context/auth-context"
import Filters from "../../components/Filters/Filters"
export default function Table(){
  const {id} = useParams()
  const {filters, setFilters, tableActivities, setTableActivities} = useAuth()
  const [showLoader, setShowLoader] = useState(true)
  const [ maxOrder, setMaxOrder ] = useState(JSON.parse(sessionStorage.getItem("maxOrder")))
  const [error, setError] = useState(null)
  useEffect(() => {
    if(!tableActivities){
      showMixedProject({id}).then(res => {
        if(res.error){
          setError(res.error)
        } else{
          setTableActivities(res.mixed_activities)
          setMaxOrder(res.max_order)
          sessionStorage.setItem("maxOrder", JSON.stringify(res.max_order))
          sessionStorage.setItem("mixedActivities", JSON.stringify(res.mixed_activities))
          setShowLoader(false)
        }
      })
    }else{
      setShowLoader(false)
    }
  },[])
  return(
    <Wrapper>
      {
        showLoader ? <Loader/>
        :
        <div style={{width: "100%", marginTop:"1rem"}}>
          <Filters maxOrder={maxOrder}/>
          <TableData>
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Proyecto</th>
                <th>Colaboradores</th>
                <th>Progreso</th>
                <th>Inicio</th>
                <th>Fin</th>
              </tr>
            </thead>
            <tbody>
              {
                tableActivities?.map(activity => (
                  <Row key={activity._id}>
                    <td style={{textAlign:"left"}}>{activity.order.join(".")}. {activity.title}</td>
                    <td>{activity.project}</td>
                    <td>{activity.users.map(user => user.username).join(", ")}</td>
                    <td>{activity.has_subactivities ? "-" : `${activity.relative_progress*100}%`}</td>
                    <td>{formatDateToString(activity.init_date)}</td>
                    <td>{formatDateToString(activity.end_date)}</td>
                  </Row>
                ))
              }
            </tbody>
          </TableData>
        </div>
      }
    </Wrapper>
   
  )
}