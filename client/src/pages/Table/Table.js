import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Row, Wrapper } from "./styles"
import { showMixedProject } from "../../services/mixed-project-service"
import { formatDateToString } from "../../utils"
import Loader from "../../components/Loader/Loader"
export default function Table(){
  const {id} = useParams()
  const [tableActivities, setTableActivities] = useState(null)
  const [showLoader, setShowLoader] = useState(true)
  useEffect(() => {
    showMixedProject({id}).then(res => {
      setTableActivities(res)
      setShowLoader(false)
    })
  },[])
  return(
    <Wrapper>
      {
        showLoader ? <Loader/>
        :
        <div style={{width: "100%"}}>
          {
            tableActivities?.map(activity => (
              <Row key={activity._id}>
                <p>{activity.order.join(".")}. {activity.title}</p>
                <p>{activity.project}</p>
                <p>{activity.has_subactivities ? "-" : `${activity.relative_progress*100}%`}</p>
                <p>{formatDateToString(activity.init_date)}</p>
                <p>{formatDateToString(activity.end_date)}</p>
              </Row>
            ))
          }
        </div>
      }
    </Wrapper>
   
  )
}