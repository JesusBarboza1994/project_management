import { useNavigate } from "react-router-dom";
import { Wrapper } from "./styles";
import { useAuth } from "../../context/auth-context";

export default function ProjectCard({projectTitle, backgroundColor, id}){
  const nav = useNavigate()
  const {setCurrentProject} = useAuth()
  const handleShowWorkspace = () => {
    console.log(projectTitle)
    setCurrentProject(projectTitle)
    nav(`/projects/${id}`)
  }

  return(
    <Wrapper backgroundColor={backgroundColor} onClick={handleShowWorkspace}>
      <p>{projectTitle}</p>
    </Wrapper>
  )
}