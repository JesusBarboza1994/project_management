import { BiSolidRightArrow } from "react-icons/bi";
import { Wrapper } from "./styles";
import { useState } from "react";

export default function ActivityCard({activity}){
  const [subActivites, setSubActivities] = useState(null)
  const handleSubActivities = () => {
    
  }
  return(
    <Wrapper>
      <BiSolidRightArrow onClick={handleSubActivities}/>
      <p>{activity.description}</p>
    </Wrapper>
  )
}