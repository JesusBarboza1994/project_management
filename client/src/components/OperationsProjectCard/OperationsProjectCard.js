import { BsStar, BsStarFill } from "react-icons/bs"
import { ColorsContainer, EachColor, IconContainer, IconsContainer, StyleColorPalette } from "./styles"
import { colors } from "../../styles"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "../../context/auth-context"
import {  restoreProject, updateColorProject, updateFavoriteProject } from "../../services/project-service"
import {PiShareFatDuotone} from "react-icons/pi"
import {MdOutlineRestoreFromTrash} from "react-icons/md"
import { listUsers } from "../../services/user-service"
export default function OperationsProjectCard({project, isDeleted}){
  const divRef = useRef(null)
  const { setListAllUsers } = useAuth()
  const {setShowModalShared, currentProject, setCurrentProject, sharedProjects, setSharedProjects,updateWorkspace, setUpdateWorkspace, favoriteProjects, setFavoriteProjects, workspaces, setWorkspaces} = useAuth()
  const [showColors, setShowColors] = useState(false)
  const handleUpdateColor = (color) => {
    updateColorProject({color, id: project._id}).then(res => {
      console.log(res)
      setUpdateWorkspace(!updateWorkspace)
      setShowColors(false)
    }).catch(err => {
      
    })
  }
  const handleSharedProject = (e) => {
    e.stopPropagation()
    setShowModalShared(true)
    setCurrentProject({...currentProject, id: project._id})
    listUsers({search:""}).then(res => {
      console.log(res)
      setListAllUsers(res)
    })
  }
  const handleRestoreProject = (e) => {
    e.stopPropagation()
    restoreProject(project._id).then(res => {
      console.log(res)
      setUpdateWorkspace(!updateWorkspace)
    })
  }
  const handleFavorite = (e) => {
    e.stopPropagation()
    updateFavoriteProject(project._id).then(res => {
      console.log(res)
      if(res.favorite){
        setFavoriteProjects([...favoriteProjects, res])
      }else{
        setFavoriteProjects(favoriteProjects.filter(favoriteProject => favoriteProject._id !== res._id))
      }
      const updateSharedProject = sharedProjects.find(sharedProject => sharedProject._id === res._id)
      if(updateSharedProject){
        setSharedProjects([...sharedProjects.filter(sharedProject => sharedProject._id !== res._id), {...updateSharedProject, favorite: !updateSharedProject.favorite}])
      }else{
        setWorkspaces(updateWorkspaceList(workspaces, res))
      }
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
        {
          isDeleted ? 
          <IconContainer ref={divRef} onClick={(e)=>{handleRestoreProject(e)}}>
            <MdOutlineRestoreFromTrash style={{scale: "1.2"}} />
          </IconContainer>
          :
          <IconContainer ref={divRef} onClick={(e)=>{handleSharedProject(e)}}>
            <PiShareFatDuotone style={{scale: "0.9", fontWeight:200}} />
          </IconContainer>
        }

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
      if (project._id === updatedProject._id) return { ...project, favorite: updatedProject.favorite };
      return project;
    });
    return { ...workspace, projects: updatedProjects };
  });

  return updatedWorkspaces
}

// function deleteProjectFromWorkspaceList(workspaceList, updatedProject){
//   const updatedWorkspaces = workspaceList.map((workspace) => {
//     const updatedProjects = workspace.projects.filter((project) => project.id !== updatedProject.id);
//     return { ...workspace, projects: updatedProjects };
//   });

//   return updatedWorkspaces
// }