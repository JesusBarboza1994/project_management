import { useEffect, useState } from "react";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import { useAuth } from "../../context/auth-context";
import { Close, Container, MirrorScreen, Modal, ProjectContainer, StyleBiTrashAlt, TitleContainer, WorkspaceContainer, WorkspaceTitleContainer, Wrapper } from "./styles";
import { createWorkspace, deleteWorkspace, listWorkspaces } from "../../services/workspace-service";
import { colors } from "../../styles";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button"
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import {MdAddCircleOutline} from "react-icons/md"
import { createProject } from "../../services/project-service";
export default function Workspace(){
  const { user, workspaces,favoriteProjects, setFavoriteProjects, setWorkspaces, updateWorkspace, setUpdateWorkspace } = useAuth()
  const [workspaceName, setWorkspaceName] = useState("")
  const [project, setProject] = useState({
    name: "",
    id: ""
  })
  const [showWorkSpaceModal, setShowWorkSpaceModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
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
  const handleDeleteWorkspace = (id) => {
    deleteWorkspace(id).then(res => {
      console.log(res)
      setUpdateWorkspace(!updateWorkspace)
    }).catch(err => {
      console.log(err)
    })
  }
  useEffect(() => {
    listWorkspaces().then(res => {
      setWorkspaces(res.workspaces)
      console.log("WORKSPACES", res)
      setFavoriteProjects(res.favoriteProjects)
    }).catch(err => {
      console.log(err)
    })
  }, [updateWorkspace])
  
  return(
    <>
      <Wrapper>
        <TitleContainer>
          <h2>{user.username}'s Workspaces</h2>
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
                      <ProjectCard key={"favorites"+project.id} project={project} />
                    )
                  })
                } 
              </ProjectContainer>
            </WorkspaceContainer>
          }
          {workspaces && workspaces.map((workspace, index_workspace) => {
            return (
              <WorkspaceContainer>
                <WorkspaceTitleContainer>
                  <h3>{workspace.name}</h3>
                  <StyleBiTrashAlt onClick={()=>handleDeleteWorkspace(workspace.id)}/>
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
        </Container>
        <Modal showModal={showWorkSpaceModal} onSubmit={(e)=>handleSubmit(e,"workspace")}>
          <h2>Create a new workspace</h2>
          <Input type={"text"} label={"Name"} placeholder={"Workspace X"} onChange={(e) => setWorkspaceName(e.target.value)}/>
          <Button text={"Create"}/>
          <Close onClick={()=>setShowWorkSpaceModal(false)}>X</Close>
        </Modal>
        <Modal showModal={showProjectModal} onSubmit={(e)=>handleSubmit(e,"project")}>
          <h2>Create a new project</h2>
          <Input type={"text"} label={"Name"} placeholder={"Project X"} onChange={(e) => setProject({...project, name: e.target.value})} />
          <Button text={"Create"} />
          <Close onClick={()=>setShowProjectModal(false)}>X</Close>
        </Modal>
      </Wrapper>
      <MirrorScreen showModal={showProjectModal || showWorkSpaceModal}> 
      </MirrorScreen>
    </>
  )
}