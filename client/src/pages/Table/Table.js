import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Row, TableData, Wrapper } from "./styles"
import { showMixedProject } from "../../services/mixed-project-service"
import {  formatDateToString, parsedDuration } from "../../utils"
import Loader from "../../components/Loader/Loader"
import { useAuth } from "../../context/auth-context"
import Filters from "../../components/Filters/Filters"
import { tableActivitiesWithFilters } from "../../services/activity-service"
export default function Table(){
  const { id } = useParams()
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const { tableActivities, setTableActivities } = useAuth()
  const [showLoader, setShowLoader] = useState(true)
  const [ maxOrder, setMaxOrder ] = useState(JSON.parse(sessionStorage.getItem("maxOrder")))
  const [error, setError] = useState(null)
  useEffect(() => {
    if(!tableActivities){
      if(type === "project"){
        tableActivitiesWithFilters({id}).then(res => {
          if(res.error){
            setError(res.error)
          } else{
            setTableActivities(res.activities)
            setMaxOrder(res.max_order)
            sessionStorage.setItem("maxOrder", JSON.stringify(res.max_order))
            sessionStorage.setItem("tableActivities", JSON.stringify(res.activities))
            setShowLoader(false)
          }
        })
      }else{
        showMixedProject({id}).then(res => {
          if(res.error){
            setError(res.error)
          } else{
            if(res.mixed_activities.length !== 0){
              setTableActivities(res.mixed_activities)
              setMaxOrder(res.max_order)
            }
            sessionStorage.setItem("maxOrder", JSON.stringify(res.max_order))
            sessionStorage.setItem("tableActivities", JSON.stringify(res.mixed_activities))
            setShowLoader(false)
          }
        })
      }
    }else{
      setShowLoader(false)
    }
  },[])
  return(
    <Wrapper>
      {
        showLoader ? <Loader/>
        :
        <div style={{width: "800px", marginTop:"1rem", overflowX: "auto"}}>
          <Filters maxOrder={maxOrder} id={id} type={type}/>
          <TableData>
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Proyecto</th>
                <th>Colaboradores</th>
                <th>Progreso</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              {
                tableActivities?.map((activity, index) => (
                  <Row key={activity._id} index={index}>
                    <td style={{textAlign:"left"}}>{activity.order.join(".")}. {activity.title}</td>
                    <td>{activity.project}</td>
                    <td>{activity.users.map(user => user.username).join(", ")}</td>
                    <td>{(activity.relative_progress*100).toFixed(1)}%</td>
                    <td>{formatDateToString(activity.init_date)}</td>
                    <td>{formatDateToString(activity.end_date)}</td>
                    <td>{parsedDuration(activity.duration)}</td>
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