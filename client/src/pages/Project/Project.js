import { useEffect, useState } from "react";
import { Container, Wrapper } from "./styles";
import { useAuth } from "../../context/auth-context";
import { useParams } from "react-router-dom";
import { listActivities } from "../../services/activity-service";
import EmptyActivity from "../../components/EmptyActivity/EmptyActivity";
import ActivityCard from "../../components/ActivityCard/ActivityCard";

export default function Project(){
  const { currentProject, updateListActivites } = useAuth()
  const [ activities, setActivities ] = useState(null)
  const [ parentId, setParentId ] = useState(null)
  const {id} = useParams()
  
  useEffect(() => {
    listActivities(id).then(res => {
      console.log(res)
      setActivities(res.activities)
      setParentId(res.parent)
    }).catch(err => {
      console.log(err)
    })
  }, [updateListActivites])
  
  return(
    <Wrapper>
      <h2>{currentProject}</h2>      
      <Container>
        {activities && activities.map(activity => {
          return(
            <ActivityCard key={activity.id} activity={activity}/>
            )
          }
          )}
        <EmptyActivity parent={parentId}/>
      </Container>
    </Wrapper>
  )
}