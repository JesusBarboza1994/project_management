import { useEffect, useState } from "react";
import { Container, MainContainer, TitleContainer, Wrapper } from "./styles";
import { useAuth } from "../../context/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import { listActivities } from "../../services/activity-service";
import EmptyActivity from "../../components/EmptyActivity/EmptyActivity";
import ActivityCard from "../../components/ActivityCard/ActivityCard";
import { BiArrowBack } from "react-icons/bi";
import { StyleBiTrashAlt } from "../Workspace/styles";
import { deleteProject } from "../../services/project-service";
import { formatDateToString } from "../../utils";
import Modal from "../../components/Modal";

export default function Project(){
  const { currentProject, updateListActivites } = useAuth()
  const [ activities, setActivities ] = useState(null)
  const [ editProjectPermission, setEditProjectPermission ] = useState("view")
  const [showModalDeleteProject, setShowModalDeleteProject] = useState(false)
  const {id} = useParams()
  const nav = useNavigate()
  const handleDeleteProject = () => {
    const isDeleted = sessionStorage.getItem("isDeleted")
    if(isDeleted==="true") return setShowModalDeleteProject(true)
    deleteProject(currentProject.id).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    sessionStorage.removeItem("isDeleted")
    nav("/workspaces")
  }

  useEffect(() => {
    listActivities(id).then(res => {
      console.log(res)
      setActivities(res.activities)
      setEditProjectPermission(res.permission)
    }).catch(err => {
      console.log(err)
    })
  }, [updateListActivites])
  
  return(
    <Wrapper>
      <Modal 
      showModal={showModalDeleteProject} 
      setShowModal={setShowModalDeleteProject}
      onSubmit={()=>{
        setShowModalDeleteProject(false)
        sessionStorage.removeItem("isDeleted")
        deleteProject(currentProject.id).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
        nav("/workspaces")
      }}
      title="¿Estas seguro que deseas eliminar este proyecto?"
      text="Eliminar"
      typeButton="solid"
      onClick={() => setShowModalDeleteProject(false)}
      />
      <MainContainer>
        <TitleContainer>
          <div>
            <BiArrowBack style={{scale:"1.5", cursor:"pointer"}} onClick={() =>{
              sessionStorage.removeItem("currentProject")
              sessionStorage.removeItem("isDeleted")
              nav("/workspaces")
            }}/>
            <h2>{currentProject.title}</h2>
          </div>
          <div>
            <p>{formatDateToString(currentProject.init_date)}</p>
            <p> : </p>
            <p>{formatDateToString(currentProject.end_date)}</p>
          </div>
          <div>
            <h2>{(currentProject.total_progress*100).toFixed(2)}%</h2>
            {
              editProjectPermission !== "view" &&
              <StyleBiTrashAlt onClick={handleDeleteProject}/>
            }      
          </div>
        </TitleContainer>
        <Container>
          {activities && activities.map((activity) => {
            return(
              <ActivityCard key={activity.id} activity={activity} editProjectPermission={editProjectPermission}/>
              )
            }
            )}
          {
            editProjectPermission !== "view" &&
            <EmptyActivity parent={id}/>
          }
        </Container>
      </MainContainer>
    </Wrapper>
  )
}