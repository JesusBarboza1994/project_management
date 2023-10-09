import { MdAddCircleOutline } from "react-icons/md";
import { Wrapper } from "./styles";
import { colors } from "../../styles";
import { useEffect, useRef, useState } from "react";
import { createActivity } from "../../services/activity-service";
import { useAuth } from "../../context/auth-context";

export default function EmptyActivity({parent}){
  const inputRef = useRef(null);
  const {setUpdateListActivities, updateListActivites} = useAuth()
  const [newActivity, setNewActivity] = useState({
    description: "",
    relativeWeight: ""
  })
  const handleNewActivity = () => {
    const body = {
      description: newActivity.description,
      relative_weight: +newActivity.relativeWeight/100,
      parent,
    }
    createActivity(body).then(res => {
      console.log(res)
      setUpdateListActivities(!updateListActivites)
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

  return(
    <Wrapper>
      <div>
        {(newActivity?.description !== "" && newActivity?.relativeWeight !== "") 
          ? <MdAddCircleOutline style={{color: colors.red.medium, scale: "1.3"}} onClick={handleNewActivity}/>
          : <MdAddCircleOutline style={{color: colors.gray.medium}}/> 
        }
        <input placeholder="Actividad vacía" type="text" value={newActivity.description} onChange={(e) => setNewActivity({...newActivity,description: e.target.value})}/>
      </div>
      <div>
        <p onClick={handleParagraphClick}>Peso relativo: </p>
        <input ref={inputRef} type="number" value={newActivity.relativeWeight} onChange={(e) => {
          setNewActivity({...newActivity,relativeWeight: e.target.value})}}/>
        <p>%</p>
      </div>
    </Wrapper>
  )
}