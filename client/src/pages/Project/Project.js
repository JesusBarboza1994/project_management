import { useEffect, useState } from "react";
import { Container, EndDiv, InitDiv, MainContainer, TitleContainer, Wrapper } from "./styles";
import { useAuth } from "../../context/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import { deleteActivity, listActivities, listTreeActivities } from "../../services/activity-service";
import EmptyActivity from "../../components/EmptyActivity/EmptyActivity";
import ActivityCard from "../../components/ActivityCard/ActivityCard";
import { BiArrowBack } from "react-icons/bi";
import { StyleBiTrashAlt } from "../Workspace/styles";
import { deleteProject, updateTitleProject } from "../../services/project-service";
import { cutString, formatDateToString } from "../../utils";
import { FaChartGantt } from "react-icons/fa6";
import Modal from "../../components/Modal";
import { colors } from "../../styles";
import { GoProjectSymlink } from "react-icons/go";
import Gantt, { getMinAndMaxDateInActivities } from "../../components/Gantt/Gantt";
import { FaTable } from "react-icons/fa";
// import { ActivityInfoModal } from "../../components/organisms/ActivityInfoModal/ActivityInfoModal";

export default function Project(){
  const { currentProject, currentActivity, setCurrentActivity, updateListActivites, updateSubActivities, setCurrentProject, setUpdateListActivities, setUpdateSubActivities } = useAuth()
  const [showModalDeleteProject, setShowModalDeleteProject] = useState(false)
  const [showModalDeleteActivity, setShowModalDeleteActivity] = useState(false)
  const [showModalCurrentActivityDetails, setShowModalCurrentActivityDetails] = useState(false)
  const [ activities, setActivities ] = useState(null)
  const [ editProjectPermission, setEditProjectPermission ] = useState("view")
  const [showGantt, setShowGantt] = useState(false)
  const [treeActivities, setTreeActivities] = useState(null)
  const [showTitle, setShowTitle] = useState(true)
  const [timeProject, setTimeProject] = useState(null)
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
    console.log("entree")
    sessionStorage.setItem("currentProject", JSON.stringify(currentProject))
    setShowTitle(true)
    document.getElementById("inputName").blur()
    updateTitleProject(currentProject.id).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); 
      console.dir(event.target) // Evita que se agregue una nueva línea
      event.target.form.dispatchEvent(new Event('submit', { cancelable: false })); // Dispara el evento submit del formulario
      sessionStorage.setItem("currentProject", JSON.stringify(currentProject))
      setShowTitle(true)
      updateTitleProject(currentProject.id).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  };

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
      setTimeProject(getMinAndMaxDateInActivities({activities: response})) 
    }
    fetchData() 
  }, [updateListActivites])
  
  return(
    <Wrapper>
      {/* <Modal showModal={showModalCurrentActivityDetails} setShowModal={setShowModalCurrentActivityDetails}>
        <ActivityInfoModal activity={currentActivity}/>
      </Modal> */}
      <Modal
        showModal={showModalDeleteActivity}
        setShowModal={setShowModalDeleteActivity}
        onSubmit={(e) => {
          e.preventDefault()
          setShowModalDeleteActivity(false)
          console.log("CUR", currentActivity)
          deleteActivity(currentActivity._id).then(res => {
            const updatedProject = {...currentProject, total_progress: res.project.total_progress}
            setCurrentProject(updatedProject)
            sessionStorage.setItem("currentProject", JSON.stringify(updatedProject))
            setUpdateListActivities(!updateListActivites)
            setUpdateSubActivities(!updateSubActivities)
            setCurrentActivity(null)
          }).catch(err => {
            console.log(err)
          })
        }}
        title="¿Estas seguro que deseas eliminar esta actividad?"
        text="Eliminar"
        typeButton="solid"
        onClick={() => setShowModalDeleteActivity(false)}
      />
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
              <form id="projectName" onSubmit={(e)=>{handleUpdateNameActivity(e)}}>
                {showTitle ? <label htmlFor="inputName" onClick={() => setShowTitle(false)}>{cutString(currentProject.title, 20)}</label>
                :
                <textarea id="inputName" value={currentProject.title} onChange={e => setCurrentProject({...currentProject, title:e.target.value})} onKeyDown={handleKeyDown}/>
              }
              </form>
            </div>
            <div style={{display:"flex", width:"60px", justifyContent: "space-between"}}>
              <FaTable style={{color:colors.primary.medium, scale:"1.5", cursor:"pointer"}} onClick={() => nav(`/tables/${currentProject.id}?type=project`)}/>
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
          <Gantt activities={treeActivities} timeProject={timeProject}/>
          <EndDiv>
            <p>{formatDateToString(currentProject.end_date)}</p>
          </EndDiv>
        </div>
        :
          <Container>
          {activities && activities.map((activity) => {
            return(
              <ActivityCard setShowModalCurrentActivityDetails={setShowModalCurrentActivityDetails} key={activity.id} activity={activity} editProjectPermission={editProjectPermission} setShowModalDeleteActivity={setShowModalDeleteActivity}/>
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