import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Row, TableData, Wrapper } from "./styles"
import { showMixedProject } from "../../services/mixed-project-service"
import { formatDateToString } from "../../utils"
import Loader from "../../components/Loader/Loader"
export default function Table(){
  const {id} = useParams()
  const [tableActivities, setTableActivities] = useState(JSON.parse(sessionStorage.getItem("mixedActivities")))
  console.log("🚀 ~ Table ~ tableActivities:", tableActivities)
  const [showLoader, setShowLoader] = useState(true)
  useEffect(() => {
    if(!tableActivities){
      showMixedProject({id}).then(res => {
        setTableActivities(res)
        sessionStorage.setItem("mixedActivities", JSON.stringify(res))
        setShowLoader(false)
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