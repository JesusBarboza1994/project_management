import { useEffect, useState } from "react";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import { useAuth } from "../../context/auth-context";
import { CollaboratorDiv, Container, List, ListProjectsModal, ListSelectedProjectsModal, ProjectContainer, Select, SharedUserDiv, StyleBiTrashAlt, TitleContainer, WorkspaceContainer, WorkspaceTitleContainer, Wrapper } from "./styles";
import { createWorkspace, deleteWorkspace, updateWorkspaceName } from "../../services/workspace-service";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import {MdAddCircleOutline} from "react-icons/md"
import { createProject, listCollaborationProjects, sharedProject } from "../../services/project-service";
import Modal from "../../components/Modal";
import { listUsers, removeCollaborator } from "../../services/user-service";
import { BiTrashAlt } from "react-icons/bi";
import { colors } from "../../styles";
import Input from "../../components/Input/Input";
import { createMixedProject } from "../../services/mixed-project-service";
export default function Workspace(){
  const { isMixedSharedProject, setIsMixedSharedProject, trashedProjects, setTableActivities, setTrashedProjects, listCollaborators, setListCollaborators, listAllUsers, setListAllUsers ,currentProject, sharedProjects, setSharedProjects, showModalShared, setShowModalShared,user, workspaces,favoriteProjects, setFavoriteProjects, setWorkspaces, updateWorkspace, setUpdateWorkspace } = useAuth()
  const [workspaceName, setWorkspaceName] = useState("")
  const [project, setProject] = useState({
    name: "",
    id: ""
  })
  const [selectedMixedProjects, setSelectedMixedProjects] = useState({
    title: "",
    projects: []
  })
  const [mixedProjects, setMixedProjects] = useState(null)
  const [showWorkSpaceModal, setShowWorkSpaceModal] = useState(false)
  const [currentWorkspace, setCurrentWorkspace] = useState("")
  const [allProjects, setAllProjects] = useState(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showMixedProjectModal, setShowMixedProjectModal] = useState(false)
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
        workspaceId: project.id,
        color: Object.keys(colors.randomColors)[Math.floor(Math.random() * Object.keys(colors.randomColors).length)]
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

  const handleMixedProject = async(e) => {
    e.preventDefault()
    setShowMixedProjectModal(false)
    setSelectedMixedProjects({
      title: "",
      projects: []
    })

    try {
      const response = await createMixedProject({selectedMixedProjects})
      setMixedProjects(...mixedProjects, response.projects)
      setUpdateWorkspace(!updateWorkspace)
    } catch (error) {
      console.log(error)
      
    }
   
  }
  const handleSharedSubmit = async (e) => {
    e.preventDefault()
    const body = {
      email: sharedProjectUser.email,
      permission: sharedProjectUser.permission,
      id: currentProject.id
    }
    if(isMixedSharedProject){
      body.mixed = isMixedSharedProject
      setIsMixedSharedProject(false)
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
    listUsers({search: e.target.value, id: currentProject.id}).then(res => {
      setListAllUsers(res.users)
    }).catch(err => {
      console.log(err)
    })
  }
  const handleDeleteCollaborator = (email, username) =>{
    removeCollaborator({id: currentProject.id, email }).then(res => {
      const filterCollaborators = listCollaborators.filter(collaborator => {
      const colabArray = res.collaborators.map(colab => colab.user)
      return colabArray.includes(collaborator._id)
      })
      setListCollaborators(filterCollaborators)
      setListAllUsers([...listAllUsers, {email, username}])
    })
  }
  useEffect(() => {
    listCollaborationProjects().then(res => {
      setWorkspaces(res.workspaces)
      setFavoriteProjects(res.favoriteProjects)
      setSharedProjects(res.sharedProjects)
      setTrashedProjects(res.trashedProjects)
      setAllProjects(res.projects)
      setMixedProjects(res.mixedProjects)
      setTableActivities(null)
      sessionStorage.removeItem("tableActivities")
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
                      <ProjectCard key={"shared"+project._id} project={project} showShared={false}/>
                    )
                  })
                } 
              </ProjectContainer>
            </WorkspaceContainer>
          }
          {workspaces && workspaces.map(workspace => {
            return (
              <WorkspaceContainer key={workspace.id}>
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
          
          <WorkspaceContainer>
            <WorkspaceTitleContainer>
              <h3>Mixed Projects</h3>
            </WorkspaceTitleContainer>
            <ProjectContainer>
                <EmptyCard text={"P"} onClick={()=>{
                  setShowMixedProjectModal(true)
                }}/>
                
                {mixedProjects && mixedProjects.map((project)=>{
                  return(
                    <ProjectCard key={project.id} project={project} mixed={true}/>
                  )
                })}
              </ProjectContainer>

          </WorkspaceContainer>
              
          
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
          title={"Create a mixed project"}
          showModal={showMixedProjectModal} 
          setShowModal={setShowMixedProjectModal}
          onClick={(e)=>{setShowMixedProjectModal(false)}}
          onSubmit={handleMixedProject}
          typeButton={"solid"}
          text={"Create Mixed"}
        >
          <>
            <Input label={"Name"} value={selectedMixedProjects.title} placeholder={"Mixed Project X"} onChange={(e) => setSelectedMixedProjects({...selectedMixedProjects, title: e.target.value})}/>
            <ListProjectsModal>
              {allProjects && allProjects.map((project)=>{
                return(
                  <div key={project._id} project={project}
                    onClick={()=>{
                      if(!selectedMixedProjects.projects.includes(project)){
                        setSelectedMixedProjects({title:selectedMixedProjects.title, projects: [...selectedMixedProjects.projects, project]})
                      }
                    }}
                  >
                    {project.title}
                  </div>
                )
              })}
            </ListProjectsModal>
              {
                selectedMixedProjects.projects.length !==0 &&
                <ListSelectedProjectsModal>
                  {selectedMixedProjects.projects.map((project)=>{
                    return(
                      <div key={`selected${project._id}`}
                        onClick={()=>setSelectedMixedProjects({title: selectedMixedProjects.title, projects: selectedMixedProjects.projects.filter(proj=>proj._id !== project._id)})}
                      >
                        {project.title}
                      </div>
                    )
                  })}
                </ListSelectedProjectsModal>
              }
          </>
        </Modal>

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
              {listAllUsers.length !== 0 && <List>
                { 
                  listAllUsers.map(user=>{
                    return(
                      <li key={user._id} onClick={()=>setSharedProjectUser({...sharedProjectUser, email: user.email})}>{user.username}</li>
                    )
                  })
                }
              </List>}
              <div style={{display:"flex", width:"100%", justifyContent:"space-between", alignItems:"center"}}>
                <Select onChange={(e) =>setSharedProjectUser({...sharedProjectUser, permission: e.target.value})}>
                  <option value="view">View</option>
                  <option value="edit">Edit</option>
                  <option value="admin">Admin</option>
                </Select>
              </div>
              <CollaboratorDiv>
                {
                   listCollaborators.map(user=>{
                    return(
                      <div>
                        <p>{user.email}</p>
                        <div style={{display:"flex", alignItems:"center", gap:"4px"}}>
                          <p>{user.permission}</p>
                          {user.permission !== "owner" && <BiTrashAlt style={{cursor:"pointer"}} onClick={()=>handleDeleteCollaborator(user.email, user.username)}/>}
                        </div>
                      </div>
                    )
                  })
                }
              </CollaboratorDiv>
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