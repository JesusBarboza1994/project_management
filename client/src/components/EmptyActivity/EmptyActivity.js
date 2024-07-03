import { MdAddCircleOutline } from "react-icons/md";
import { Container, Wrapper } from "./styles";
import { colors } from "../../styles";
import { useRef, useState } from "react";
import { createActivity } from "../../services/activity-service";
import { useAuth } from "../../context/auth-context";
import Information from "../Information/Information";
import Loader from "../Loader/Loader";

export default function EmptyActivity({parent}){
  const inputRef = useRef(null);
  const {setUpdateListActivities, updateListActivites, setUpdateSubActivities, updateSubActivities, setCurrentProject, currentProject} = useAuth()
  const [newActivity, setNewActivity] = useState({
    title: "",
    relativeWeight: ""
  })
  const [showInfo, setShowInfo] = useState(false)
  const [showLoad, setShowLoad] = useState(false)
  const submitButtonRef = useRef();

  const handleClickH1 = () => {
    // Simula el clic en el botón de tipo "submit"
    submitButtonRef.current.click();
  };
  const handleNewActivity = (e) => {
    e.preventDefault();
    if(newActivity.title === "" || newActivity.relativeWeight === "" || newActivity.relativeWeight === 0) return
    const body = {
      title: newActivity.title,
      relative_weight: +newActivity.relativeWeight,
      parent,
    }
    setShowLoad(true)
    createActivity(body).then(res => {
      setUpdateListActivities(!updateListActivites)
      setUpdateSubActivities(!updateSubActivities)
      const updatedProject = {...currentProject, total_progress: res.project.total_progress}
      setCurrentProject(updatedProject)
      setShowLoad(false)
      sessionStorage.setItem("currentProject", JSON.stringify(updatedProject))
      setNewActivity({
        title: "",
        relativeWeight: ""
      })

    }).catch(err => {
      console.log(err)
    })

  }
  const handleParagraphClick = () => {
    inputRef.current.focus(); // Enfocar el input cuando se haga clic en el párrafo
  };
  return(
    <Wrapper onSubmit={(e)=>handleNewActivity(e)}>
      <Container>
        {(newActivity?.title !== "" && newActivity?.relativeWeight !== "") 
          ? <MdAddCircleOutline style={{color: colors.icon.primary, scale: "1.3"}} onClick={handleClickH1}/>
          : <MdAddCircleOutline style={{color: colors.icon.secondary}}/> 
        }
        <input placeholder="Actividad vacía" type="text" value={newActivity.title} onChange={(e) => setNewActivity({...newActivity,title: e.target.value})}/>
      </Container>
      <Container style={{position: "relative"}}>
        {/* <Information showInfo={showInfo} text={"Asigna el peso respecto a la actividad padre"}/> */}
        { showLoad && <Loader/> }
        <p onClick={handleParagraphClick}>Peso asignado: </p>
        <input ref={inputRef} type="number" value={newActivity.relativeWeight} onChange={(e) => {
          setNewActivity({...newActivity,relativeWeight: e.target.value})}}/>
      </Container>
      <input type="submit" value={""} hidden ref={submitButtonRef}/>
    </Wrapper>
  )
}