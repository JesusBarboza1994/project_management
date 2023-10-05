import { useEffect, useState } from "react";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import { useAuth } from "../../context/auth-context";
import { Close, Container, MirrorScreen, Modal, Wrapper } from "./styles";
import { listWorkspaces } from "../../services/workspace-service";
import WorkSpaceCard from "../../components/WorkSpaceCard/WorkSpaceCard";
import { colors } from "../../styles";

export default function Workspace(){
  const { user,showModal, setShowModal, workspaces, setWorkspaces } = useAuth()
  
  useEffect(() => {
    listWorkspaces().then(res => {
      console.log(res)
      setWorkspaces(res)
    }).catch(err => {
      console.log(err)
    })
  }, [])
  
  return(
    <>
    <Wrapper>
      <h2>{user.username}'s Workspaces</h2>
      <Container>
        <EmptyCard/>
        {workspaces && workspaces.map(workspace => {
          return (
            <WorkSpaceCard id={workspace._id} workspaceName={workspace.name} backgroundColor={colors.getRandomColor()}/>
          )
        })}
      </Container>
    </Wrapper>
      <MirrorScreen showModal={showModal}> 
        <Modal showModal={showModal}>
        <Close onClick={()=>setShowModal(false)}>X</Close>
        </Modal>
      </MirrorScreen>
    </>
  )
}