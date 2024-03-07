import { useNavigate } from "react-router-dom";
import { Wrapper } from "./styles";
import { useAuth } from "../../context/auth-context";
import { colors } from "../../styles";

import OperationsProjectCard from "../OperationsProjectCard/OperationsProjectCard";
export default function ProjectCard({project, isDeleted=false, showShared=true, mixed=false}) {
  const nav = useNavigate()
  const {setCurrentProject } = useAuth()
  
  const handleShowProject = () => {
    if(!mixed){
      setCurrentProject({title: project.title,
        total_progress: project.total_progress,
        id: project._id,
        init_date: project.init_date,
        end_date: project.end_date
      })
      sessionStorage.setItem("currentProject", JSON.stringify({title: project.title,
        total_progress: project.total_progress,
        id: project._id,
        init_date: project.init_date,
        end_date: project.end_date
      }))
      sessionStorage.setItem("isDeleted", isDeleted)
      nav(`/projects/${project._id}`)
    }else{
      setCurrentProject(project)
      sessionStorage.setItem("currentProject", JSON.stringify(project))
      nav(`/tables/${project._id}`)
    }
  } 

  return(
    <Wrapper backgroundColor={colors.randomColors[project.color]} onClick={handleShowProject}>
      <div style={{ overflow: "hidden" }}>
        <p>{project.title}</p>
        {!mixed && <p>{(project.total_progress*100).toFixed(2)}%</p>}
      </div>
      <OperationsProjectCard project={project} isDeleted={isDeleted} showShared={showShared} mixed={mixed}/>
    </Wrapper>
  )
}

