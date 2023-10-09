import { MdAddCircleOutline } from "react-icons/md";
import { Wrapper } from "./styles";
import { colors } from "../../styles";
import { useEffect, useRef, useState } from "react";

export default function EmptyActivity({parent, parentType}){
  const inputRef = useRef(null);
  const [newActivity, setNewActivity] = useState({
    description: "",
    relativeWeight: ""
  })
  const [availableNewActivity, setAvailableNewActivity] = useState(false)
  const handleNewActivity = () => {

    const body = {
      description: newActivity.description,
      relative_weight: newActivity.relativeWeight,
      parent,

    }
    if(parentType==="project"){ 
      body.index = 1
      body.absolute_weight = newActivity.relativeWeight
    }
  }
  const handleParagraphClick = () => {
    inputRef.current.focus(); // Enfocar el input cuando se haga clic en el párrafo
  };

  return(
    <Wrapper onClick={handleNewActivity}>
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
      </div>
    </Wrapper>
  )
}