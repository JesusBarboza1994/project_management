import { BiSolidDownArrow, BiSolidRightArrow, BiTrashAlt } from "react-icons/bi";
import { SubActivitiesContainer, TitleContainer, Wrapper } from "./styles";
import { useEffect, useState } from "react";
import { colors } from "../../styles";
import { deleteActivity, listActivities } from "../../services/activity-service";
import { useAuth } from "../../context/auth-context";
import EmptyActivity from "../EmptyActivity/EmptyActivity";

export default function ActivityCard({activity}){
  const [subActivities, setSubActivities] = useState(null)
  const {setUpdateListActivities, updateListActivites} = useAuth()
  const [updateSubActivities, setUpdateSubActivities] = useState(false)
  const handleSubActivities = () => {
    listActivities(activity._id).then(res => {
      console.log(res)
      setSubActivities(res.activities)
    }).catch(err => {
      console.log(err)
    })
  }

  const handleDeleteActivity = () => {
    deleteActivity(activity._id).then(res => {
      console.log(res)
      setUpdateListActivities(!updateListActivites)
    }).catch(err => {
      console.log(err)
    })
  }
  useEffect(() => {
    
  },[updateSubActivities])
  return(
    <>
      <Wrapper>
        <TitleContainer>
          {subActivities 
            ? <BiSolidDownArrow onClick={()=> setSubActivities(null)}/>
            : <BiSolidRightArrow onClick={handleSubActivities}/>
          }
          <p>{activity.description}</p>
        </TitleContainer>
        <BiTrashAlt onClick={handleDeleteActivity} style={{color:colors.red.dark, scale: "1.1"}}/>
      </Wrapper>
      {
        subActivities &&
        <SubActivitiesContainer>
          {
            subActivities.map(subactivity =>{
              return(
                <ActivityCard key={subactivity._id} activity={subactivity}/>
              )
            })
          }
          <EmptyActivity parent={activity._id}/>
        </SubActivitiesContainer>
      }
    </>
  )
}