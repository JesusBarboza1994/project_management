import { BiSolidDownArrow, BiSolidRightArrow, BiSolidCircle } from "react-icons/bi"
import { ActivityDiv, ModalDate, Row, Wrapper } from "./styles"
import { useEffect, useState } from "react"
import { colors } from "../../styles"
import { formatDateToString } from "../../utils"
import { useAuth } from "../../context/auth-context"

export default function Gantt({activities, parentCurrentWidth, currentPadding=0}){
  const specificActivities = activities || JSON.parse(sessionStorage.getItem("activities"))
  const { init_date, end_date } = getMinAndMaxDateInActivities({activities: specificActivities}) 
  const [showSubactivities, setShowSubactivities] = useState(new Array(specificActivities.length).fill(false))
  const totalWidth = (end_date - init_date )/100
  const [showModalDate, setShowModalDate] = useState(new Array(specificActivities.length).fill(false))
  
  return(
    <Wrapper>
      {
        specificActivities.map((activity, index) => {
          const initWidth = (new Date(activity.init_date) - init_date  ) / totalWidth
          const currentWidth = (parentCurrentWidth ? parentCurrentWidth/100 : 1) * (new Date(activity.end_date) - new Date(activity.init_date) )/totalWidth 
          const endWidth = (end_date - new Date(activity.end_date) )/totalWidth
          const colorValue =  Object.keys(colors.randomColors)[activity.index]
          return(
            <div key={activity._id}>
              <Row style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{width:"20%", display:"flex", alignItems:"center"}}>
                  {activity.activities.length !==0 ? (showSubactivities[index] ? 
                  <BiSolidDownArrow style={{cursor:"pointer", scale:"0.7"}} onClick={()=> {
                    const newShowSubactivities = [...showSubactivities]
                    newShowSubactivities[index] = !newShowSubactivities[index]
                    setShowSubactivities(newShowSubactivities)
                  }}/> :
                  <BiSolidRightArrow style={{cursor:"pointer", scale:"0.7"}} onClick={()=> {
                    const newShowSubactivities = [...showSubactivities]
                    newShowSubactivities[index] = !newShowSubactivities[index]
                    setShowSubactivities(newShowSubactivities)
                  }}/>) :
                  <BiSolidCircle style={{scale:"0.7"}}/>
                  }
                  <p style={{fontSize:"12px"}}>{activity.title}</p>
                </div>
                <div style={{display:"flex", width:"100%", alignItems:"center", borderLeft: `1px solid ${colors.secondary.light}`, borderRight: `1px solid ${colors.secondary.light}` }}>
                  <div style={{width: `${initWidth}%`}}/>
                  <ActivityDiv style={{width: `${currentWidth}%`, position: "relative"}} colorValue={colorValue} 
                    onMouseOver={()=>{
                      const newShowModalDate = [...showModalDate]
                      newShowModalDate[index] = true
                      setShowModalDate(newShowModalDate)
                    }}
                    onMouseLeave={()=>{
                      const newShowModalDate = [...showModalDate]
                      newShowModalDate[index] = false
                      setShowModalDate(newShowModalDate)
                    }}
                  >
                    <div style={{width: `${activity.relative_progress*100}%`, background:"red", height:"100%", borderRadius:"8px"}}/>
                    {showModalDate[index] && 
                      <ModalDate>
                        <p>Inicio: {formatDateToString(activity.init_date)}</p>
                        <p>Fin: {formatDateToString(activity.end_date)}</p>
                      </ModalDate>}
                  </ActivityDiv>
                  <div style={{width: `${endWidth}%` }}/>
                </div>
              </Row>
              { (showSubactivities[index] && activity.activities.length !== 0) && <Gantt activities={activity.activities} parentCurrentWidth={currentWidth} currentPadding={currentPadding+3}/>}
            </div>
          )
        })
      }
    </Wrapper>
  )
}

function getMinAndMaxDateInActivities({activities}){
  let init_date
  let end_date
  activities.forEach(activity => {
    if(init_date){
      if(init_date > new Date(activity.init_date)) init_date = new Date(activity.init_date)
    }else{
      init_date = new Date(activity.init_date)
    }

    if(end_date){
      if(end_date < new Date(activity.end_date)) end_date = new Date(activity.end_date)
    }else{
      end_date = new Date(activity.end_date)
    }
  })

  return { init_date, end_date }
}