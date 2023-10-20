import { useEffect, useState } from "react";
import { Container, TitleContainer, Wrapper } from "./styles";
import { useAuth } from "../../context/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import { listActivities } from "../../services/activity-service";
import EmptyActivity from "../../components/EmptyActivity/EmptyActivity";
import ActivityCard from "../../components/ActivityCard/ActivityCard";
import { BiArrowBack } from "react-icons/bi";
import { StyleBiTrashAlt } from "../Workspace/styles";
import { deleteProject } from "../../services/project-service";

export default function Project(){
  const { currentProject, updateListActivites } = useAuth()
  const [ activities, setActivities ] = useState(null)
  const [ parentId, setParentId ] = useState(null)
  const {id} = useParams()
  const nav = useNavigate()
  const handleDeleteProject = () => {
    deleteProject(currentProject.id).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    nav("/workspaces")
  }
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
      <TitleContainer>
        <div>
          <BiArrowBack style={{scale:"1.5", cursor:"pointer"}} onClick={() =>{
            sessionStorage.removeItem("currentProject")
            nav("/workspaces")
          }}/>
          <h2>{currentProject.title}</h2>
        </div>
        <div>
          <h2>{(currentProject.total_progress*100).toFixed(2)}%</h2>      
          <StyleBiTrashAlt onClick={handleDeleteProject}/>
        </div>
      </TitleContainer>
      <Container>
        {activities && activities.map((activity) => {
          return(
            <ActivityCard key={activity.id} activity={activity}/>
            )
          }
          )}
          {console.log("PARENTID", parentId)}
        <EmptyActivity parent={id}/>
      </Container>
    </Wrapper>
  )
}