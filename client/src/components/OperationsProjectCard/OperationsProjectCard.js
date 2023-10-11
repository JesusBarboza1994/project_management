import { BsStar, BsStarFill } from "react-icons/bs"
import { ColorsContainer, EachColor, IconContainer, IconsContainer, StyleColorPalette } from "./styles"
import { BiTrashAlt } from "react-icons/bi"
import { colors } from "../../styles"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "../../context/auth-context"
import { deleteProject, updateColorProject, updateFavoriteProject } from "../../services/project-service"

export default function OperationsProjectCard({project}){
  const divRef = useRef(null)
  const {updateWorkspace, setUpdateWorkspace, favoriteProjects, setFavoriteProjects, workspaces, setWorkspaces} = useAuth()
  const [showColors, setShowColors] = useState(false)
  const handleUpdateColor = (color) => {
    updateColorProject({color, id: project.id}).then(res => {
      console.log(res)
      setUpdateWorkspace(!updateWorkspace)
      setShowColors(false)
    }).catch(err => {
      
    })
  }
  const handleDeleteProject = (e) => {
    e.stopPropagation()
    deleteProject(project.id).then(res => {
      console.log(res)
      setWorkspaces(deleteProjectFromWorkspaceList(workspaces, project))
    }).catch(err => {
      console.log(err)
    })
  }
  const handleFavorite = (e) => {
    e.stopPropagation()
    updateFavoriteProject(project.id).then(res => {
      console.log(res)
      if(res.favorite){
        setFavoriteProjects([...favoriteProjects, res])
      }else{
        setFavoriteProjects(favoriteProjects.filter(favoriteProject => favoriteProject.id !== res.id))
      }
      setWorkspaces(updateWorkspaceList(workspaces, res))
    })
  }
  useEffect(() => {
    // Función para manejar clics en el documento
    const handleClickOutside = (e) => {
      if (divRef.current && !divRef.current.contains(e.target)) {
        // El clic ocurrió fuera del div, cierra el div
        setShowColors(false);
      }
    };
    if (showColors) {
      document.addEventListener('click', handleClickOutside);
    }
    // Eliminar el manejador de eventos al desmontar el componente
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showColors]);
  
  return(
    <>
    <IconsContainer>
        {
          project.favorite ? 
          <IconContainer onClick={(e)=>handleFavorite(e)}>
            <BsStarFill style={{scale: "0.9", color:colors.randomColors.yellow}} />
          </IconContainer> :
          <IconContainer onClick={(e)=>handleFavorite(e)}>
            <BsStar style={{scale: "0.9"}}/>
          </IconContainer>
        }
        
        <IconContainer ref={divRef} onClick={(e) => {setShowColors(!showColors); e.stopPropagation()}}>
          <StyleColorPalette style={{scale: "0.9"}} />
        </IconContainer>
        <IconContainer ref={divRef} onClick={(e)=>handleDeleteProject(e)}>
          <BiTrashAlt style={{scale: "0.9"}} />
        </IconContainer>
      </IconsContainer>

      <ColorsContainer showColors={showColors}>
        {Object.entries(colors.randomColors).map((color, index) => {
          return(
            <EachColor color={color[1]} key={color[1]+index} onClick={(e) => {handleUpdateColor(color[0]); e.stopPropagation()}}/>
          )
        })}
      </ColorsContainer>
    </>
  )
}

function updateWorkspaceList(workspaceList, updatedProject){
  const updatedWorkspaces = workspaceList.map((workspace) => {
    const updatedProjects = workspace.projects.map((project) => {
      if (project.id === updatedProject.id) return { ...project, favorite: updatedProject.favorite };
      return project;
    });
    return { ...workspace, projects: updatedProjects };
  });

  return updatedWorkspaces
}

function deleteProjectFromWorkspaceList(workspaceList, updatedProject){
  const updatedWorkspaces = workspaceList.map((workspace) => {
    const updatedProjects = workspace.projects.filter((project) => project.id !== updatedProject.id);
    return { ...workspace, projects: updatedProjects };
  });

  return updatedWorkspaces
}