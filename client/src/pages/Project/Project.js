import { useEffect } from "react";
import { Wrapper } from "./styles";
import { listProjects } from "../../services/project-service";
import { useAuth } from "../../context/auth-context";

export default function Project(){
  const { setProjects, currentWorkspace } = useAuth()
  
  useEffect(() => {
    listProjects(currentWorkspace.id).then(res => {
      console.log(res)
      setProjects(res)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])
  
  return(
    <Wrapper>
      <h2>{currentWorkspace.name}</h2>
    </Wrapper>
  )
}