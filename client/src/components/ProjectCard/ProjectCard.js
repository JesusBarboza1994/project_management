import { useNavigate } from "react-router-dom";
import { Wrapper } from "./styles";
import { useAuth } from "../../context/auth-context";
import { colors } from "../../styles";

import OperationsProjectCard from "../OperationsProjectCard/OperationsProjectCard";
export default function ProjectCard({project}){
  // projectTitle, backgroundColor, id, favorite
  const nav = useNavigate()
  const {setCurrentProject} = useAuth()
  
  const handleShowProject = () => {
    setCurrentProject(project.title)
    sessionStorage.setItem("currentProject", project.title)
    nav(`/projects/${project.id}`)
  } 

  return(
    <Wrapper backgroundColor={colors.randomColors[project.color]} onClick={handleShowProject}>
      <p>{project.title}</p>
      <OperationsProjectCard project={project}/>
    </Wrapper>
  )
}

