import { MdAddCircleOutline } from "react-icons/md";
import { Container, Wrapper } from "./styles";
import { colors } from "../../styles";
import { useEffect, useRef, useState } from "react";
import { createActivity } from "../../services/activity-service";
import { useAuth } from "../../context/auth-context";
import Information from "../Information/Information";



export default function EmptyActivity({parent}){
  const inputRef = useRef(null);
  const {setUpdateListActivities, updateListActivites, setUpdateSubActivities, updateSubActivities} = useAuth()
  const [newActivity, setNewActivity] = useState({
    description: "",
    relativeWeight: ""
  })
  const [showInfo, setShowInfo] = useState(false)
  const submitButtonRef = useRef();
  const showInfoRef = useRef();
  // Manejador de clic para el elemento "h1"
  const handleClickH1 = () => {
    // Simula el clic en el botón de tipo "submit"
    submitButtonRef.current.click();
  };
  const handleNewActivity = (e) => {
    e.preventDefault();
    if(newActivity.description === "" || newActivity.relativeWeight === "" || newActivity.relativeWeight === 0) return
    const body = {
      description: newActivity.description,
      relative_weight: +newActivity.relativeWeight,
      parent,
    }
    console.log("BODY", body)
    createActivity(body).then(res => {
      console.log(res)
      setUpdateListActivities(!updateListActivites)
      setUpdateSubActivities(!updateSubActivities)
      setNewActivity({
        description: "",
        relativeWeight: ""
      })

    }).catch(err => {
      console.log(err)
    })

  }
  const handleParagraphClick = () => {
    inputRef.current.focus(); // Enfocar el input cuando se haga clic en el párrafo
  };
  const handleMouseEnter = () => {
    console.log(showInfo)
    setShowInfo(true);
  }
  const handleMouseLeave = () => {
    console.log(showInfo)
    setShowInfo(false);
  }

  return(
    <Wrapper onSubmit={(e)=>handleNewActivity(e)}>
      <Container>
        {(newActivity?.description !== "" && newActivity?.relativeWeight !== "") 
          ? <MdAddCircleOutline style={{color: colors.red.medium, scale: "1.3"}} onClick={handleClickH1}/>
          : <MdAddCircleOutline style={{color: colors.gray.medium}}/> 
        }
        <input placeholder="Actividad vacía" type="text" value={newActivity.description} onChange={(e) => setNewActivity({...newActivity,description: e.target.value})}/>
      </Container>
      <Container style={{position: "relative"}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Information showInfo={showInfo} text={"Asigna el peso respecto a la actividad padre"}/>
        <p onClick={handleParagraphClick}>Peso relativo asignado: </p>
        <input ref={inputRef} type="number" value={newActivity.relativeWeight} onChange={(e) => {
          setNewActivity({...newActivity,relativeWeight: e.target.value})}}/>
      </Container>
      <input type="submit" value={""} hidden ref={submitButtonRef}/>
    </Wrapper>
  )
}