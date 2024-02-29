import { useEffect, useState } from "react";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import { useAuth } from "../../context/auth-context";
import { Container, List, ProjectContainer, Select, SharedUserDiv, StyleBiTrashAlt, TitleContainer, WorkspaceContainer, WorkspaceTitleContainer, Wrapper } from "./styles";
import { createWorkspace, deleteWorkspace, listWorkspaces, updateWorkspaceName } from "../../services/workspace-service";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import {MdAddCircleOutline} from "react-icons/md"
import { createProject, sharedProject } from "../../services/project-service";
import Modal from "../../components/Modal";
import { listUsers } from "../../services/user-service";
export default function Workspace(){
  const { trashedProjects, setTrashedProjects, listAllUsers, setListAllUsers ,currentProject, sharedProjects, setSharedProjects, showModalShared, setShowModalShared,user, workspaces,favoriteProjects, setFavoriteProjects, setWorkspaces, updateWorkspace, setUpdateWorkspace } = useAuth()
  const [workspaceName, setWorkspaceName] = useState("")
  const [project, setProject] = useState({
    name: "",
    id: ""
  })
  const [showWorkSpaceModal, setShowWorkSpaceModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [currentWorkspace, setCurrentWorkspace] = useState("")
  const [showDeleteWorkspaceModal, setShowDeleteWorkspaceModal] = useState(false)  
  const [sharedProjectUser, setSharedProjectUser] = useState({
    email: "",
    permission:"view"
  })
  const handleSubmit = async (e, modal) => {
    e.preventDefault()
    if(modal === "workspace"){
      createWorkspace(workspaceName).then(res => {
        setUpdateWorkspace(!updateWorkspace)
        setWorkspaceName("")
      }).catch(err => {
        console.log(err)
      })
      setShowWorkSpaceModal(false)
    }
    if(modal=== "project"){
      const body = {
        title: project.name,
        workspaceId: project.id
      }
      createProject(body).then(res => {
        setUpdateWorkspace(!updateWorkspace)
        setProject({
          name:"",
          id: ""
        })
      }).catch(err => {
        console.log(err)
      })
      setShowProjectModal(false)
    }
    
  }
  const handleUpdateWorkspace = (e,name, id) =>{
    e.preventDefault()
    updateWorkspaceName(id, name).then(res => {
    document.getElementById("workspaceInput").blur()
    }).catch(err => {
      console.log(err)
    })
  }
  const handleDeleteWorkspace = (id) => {
    deleteWorkspace(id).then(res => {
      console.log(res)
      setUpdateWorkspace(!updateWorkspace)
    }).catch(err => {
      console.log(err)
    })
  }


  const handleSharedSubmit = async (e) => {
    e.preventDefault()
    const body = {
      email: sharedProjectUser.email,
      permission: sharedProjectUser.permission,
      id: currentProject.id
    }
    sharedProject(body).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    setShowModalShared(false)
  }
  const handleListUsers = async (e) => {
    e.preventDefault()
    listUsers({search: e.target.value}).then(res => {
      setListAllUsers(res)
    }).catch(err => {
      console.log(err)
    })
  }
  useEffect(() => {
    listWorkspaces().then(res => {
      setWorkspaces(res.workspaces)
      setFavoriteProjects(res.favoriteProjects)
      setSharedProjects(res.sharedProjects)
      setTrashedProjects(res.trashedProjects)
    }).catch(err => {
      console.log(err)
    })
  }, [updateWorkspace])

  return(
    <>
      <Wrapper>
        <TitleContainer>
          <h2>ESPACIOS DE TRABAJO DE {user.username}</h2>
          <MdAddCircleOutline style={{scale:"2"}} onClick={()=>setShowWorkSpaceModal(true)}/>
        </TitleContainer>
        <Container>
          {favoriteProjects.length !==0 &&
            <WorkspaceContainer>
              <WorkspaceTitleContainer>
                <h3>Favorites</h3>
              </WorkspaceTitleContainer>
              <ProjectContainer>
                {
                  favoriteProjects.map(project=>{
                    return(
                      <ProjectCard key={"favorites"+project._id} project={project} />
                    )
                  })
                } 
              </ProjectContainer>
            </WorkspaceContainer>
          }
           {sharedProjects.length !==0 &&
            <WorkspaceContainer>
              <WorkspaceTitleContainer>
                <h3>Shared Projects</h3>
              </WorkspaceTitleContainer>
              <ProjectContainer>
                {
                  sharedProjects.map(project=>{
                    return(
                      <ProjectCard key={"shared"+project._id} project={project} />
                    )
                  })
                } 
              </ProjectContainer>
            </WorkspaceContainer>
          }
          {workspaces && workspaces.map(workspace => {
            return (
              <WorkspaceContainer>
                <WorkspaceTitleContainer>
                  <form onSubmit={(e)=>handleUpdateWorkspace(e, workspace.name, workspace.id)}>
                    <input id="workspaceInput" value={workspace.name} onChange={(e) => setWorkspaces([...workspaces.filter(wkspace=>wkspace.id !== workspace.id),{...workspace, name: e.target.value}])}/>
                    <input type="submit" hidden/>
                  </form>
                  <StyleBiTrashAlt onClick={()=>{
                    setCurrentWorkspace(workspace.id)
                    setShowDeleteWorkspaceModal(true)
                    }}/>
                </WorkspaceTitleContainer>
                <ProjectContainer>
                  <EmptyCard onClick={()=>{
                    setShowProjectModal(true)
                    setProject({
                      ...project,
                      id: workspace.id
                    })
                  }}/>
                  {workspace.projects.length!==0 && workspace.projects.map((project) => {
                    return(
                      <ProjectCard key={project.id} project={project}/>
                    )
                  })}
                </ProjectContainer>
              </WorkspaceContainer>
            )
          })}
          {trashedProjects.length !==0 &&
            <WorkspaceContainer>
              <WorkspaceTitleContainer>
                <h3>Trash</h3>
              </WorkspaceTitleContainer>
              <ProjectContainer>
                {
                  trashedProjects.map(project=>{
                    return(
                      <ProjectCard key={"favorites"+project._id} project={project} isDeleted={true}/>
                    )
                  })
                } 
              </ProjectContainer>
            </WorkspaceContainer>
          }
        </Container>
        <Modal 
          title={"Create a new workspace"}
          type={"text"}
          label={"Name"}
          placeholder={"Workspace X"}
          onChange={(e) => setWorkspaceName(e.target.value)}
          showModal={showWorkSpaceModal} onSubmit={(e)=>handleSubmit(e,"workspace")}
          setShowModal={setShowWorkSpaceModal}
          typeButton={"solid"}
          text={"Create"}
          onClick={()=>setShowWorkSpaceModal(false)}
         />
        <Modal
          title={"Create a new project"}
          type={"text"}
          label={"Name"}
          placeholder={"Project X"}
          onChange={(e) => setProject({...project, name: e.target.value})}
          showModal={showProjectModal} 
          setShowModal={setShowProjectModal}
          onClick={()=>setShowProjectModal(false)}
          onSubmit={(e)=>handleSubmit(e,"project")}
          typeButton={"solid"}
          text={"Create"}
          />

        <Modal
          title={"Share this project"}
          type={"text"}
          showModal={showModalShared}
          setShowModal={setShowModalShared}
          label={"Email"}
          placeholder={"Buscar por correo o por usuario"}
          onChange={(e) => handleListUsers(e)}
          onClick={()=>setShowModalShared(false)}
          onSubmit={(e)=>handleSharedSubmit(e)}
          typeButton={"solid"}
          isListed = {true}
          text={"Share"}
          >
            <>
              <List>
                {
                  listAllUsers.map(user=>{
                    return(
                      <li key={user._id} onClick={()=>setSharedProjectUser({...sharedProjectUser, email: user.email})}>{user.username}</li>
                    )
                  })
                }
              </List>
              <div style={{display:"flex", width:"100%", justifyContent:"space-between", alignItems:"center"}}>
                <Select onChange={(e) =>setSharedProjectUser({...sharedProjectUser, permission: e.target.value})}>
                  <option value="view">View</option>
                  <option value="edit">Edit</option>
                  <option value="admin">Admin</option>
                </Select>
              </div>
              { sharedProjectUser.email &&
                <SharedUserDiv>
                <p>{sharedProjectUser.email}</p>
                <p>{sharedProjectUser.permission}</p>
              </SharedUserDiv>}
            </>

          </Modal>
          <Modal 
            showModal={showDeleteWorkspaceModal} 
            setShowModal={setShowDeleteWorkspaceModal}
            onSubmit={(e)=>{
              e.preventDefault()
              handleDeleteWorkspace(currentWorkspace)
              setShowDeleteWorkspaceModal(false)
              setCurrentWorkspace("")
            }}
            title="¿Estas seguro que deseas eliminar este espacio de trabajo?"
            text="Eliminar"
            typeButton="solid"
            onClick={() => setShowDeleteWorkspaceModal(false)}
          />
      </Wrapper>
    </>
  )
}