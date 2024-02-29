import { useEffect, useState } from "react";
import { Container, EndDiv, InitDateP, InitDiv, MainContainer, PerpendicularLine, TitleContainer, Wrapper } from "./styles";
import { useAuth } from "../../context/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import { listActivities, listTreeActivities } from "../../services/activity-service";
import EmptyActivity from "../../components/EmptyActivity/EmptyActivity";
import ActivityCard from "../../components/ActivityCard/ActivityCard";
import { BiArrowBack } from "react-icons/bi";
import { StyleBiTrashAlt } from "../Workspace/styles";
import { deleteProject, updateTitleProject } from "../../services/project-service";
import { formatDateToString } from "../../utils";
import { FaChartGantt } from "react-icons/fa6";
import Modal from "../../components/Modal";
import { colors } from "../../styles";
import { GoProjectSymlink } from "react-icons/go";
import Gantt from "../../components/Gantt/Gantt";

export default function Project(){
  const { currentProject, updateListActivites, setCurrentProject } = useAuth()
  const [ activities, setActivities ] = useState(null)
  const [ editProjectPermission, setEditProjectPermission ] = useState("view")
  const [showModalDeleteProject, setShowModalDeleteProject] = useState(false)
  const [showGantt, setShowGantt] = useState(false)
  const [treeActivities, setTreeActivities] = useState(null)
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
  const handleUpdateNameActivity = (e) => {
    e.preventDefault()
    sessionStorage.setItem("currentProject", JSON.stringify(currentProject))
    document.getElementById("inputName").blur()
    updateTitleProject(currentProject.id).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    listActivities(id).then(res => {
      setActivities(res.activities)
      sessionStorage.setItem("activities",JSON.stringify(res.activities))
      setEditProjectPermission(res.permission)
    }).catch(err => {
      console.log(err)
    })

    const fetchData = async () => {
      const response = await listTreeActivities();
      setTreeActivities(response)
    }
    fetchData() 
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
            <div>
              <BiArrowBack style={{scale:"1.5", cursor:"pointer"}} onClick={() =>{
                sessionStorage.removeItem("currentProject")
                sessionStorage.removeItem("isDeleted")
                nav("/workspaces")
              }}/>
              <form id="projectName" onSubmit={(e)=>handleUpdateNameActivity(e)}>
                <input id="inputName" value={currentProject.title} onChange={e => setCurrentProject({...currentProject, title:e.target.value})}/>
              </form>
            </div>
            <div style={{display:"flex", alignItems:"center", marginRight:"8px"}}>
              {
                showGantt ?
                <GoProjectSymlink style={{color:colors.primary.medium, scale:"1.5", cursor:"pointer"}} onClick={() => setShowGantt(false)}/>
                :
                <FaChartGantt style={{color:colors.primary.medium, scale:"1.5", cursor:"pointer"}} onClick={() => setShowGantt(true)}/>
              }
            </div>
            <div>
              <p>{formatDateToString(currentProject.init_date)}</p>
              <p> : </p>
              <p>{formatDateToString(currentProject.end_date)}</p>
            </div>
            
          </div>
          <div>
            <h2>{(currentProject.total_progress*100).toFixed(2)}%</h2>
            {
              editProjectPermission !== "view" &&
              <StyleBiTrashAlt onClick={handleDeleteProject}/>
            }      
          </div>
        </TitleContainer>
        { showGantt 
        ? 
        treeActivities && 
        <div style={{position:"relative", paddingTop: "24px"}}>
          <InitDiv >
            <p>{formatDateToString(currentProject.init_date)}</p>
          </InitDiv>
          <Gantt activities={treeActivities}/>
          <EndDiv>
            <p>{formatDateToString(currentProject.end_date)}</p>
          </EndDiv>
        </div>
        :
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
        </Container>}
      </MainContainer>
    </Wrapper>
  )
}