import styled from "@emotion/styled";
import { colors } from "../../styles";
import { BiTrashAlt } from "react-icons/bi";

export const Wrapper = styled.div`
  width: 80%;
  margin:auto;
  margin-top: 60px;
  min-height: 200px;
  padding: 24px;
  background:${colors.white};
  border-radius: 20px;
  display:flex;
  flex-direction:column;
  align-items:center;
  @media(max-width:640px){
    width:90%;
  }
`

export const Container = styled.div`
  margin-top: 16px;
  display:flex;
  width:100%;
  flex-wrap: wrap;
  justify-content: flex-start;
  flex-direction:column;
  gap:24px;
`

export const ProjectContainer = styled.div`
  display:flex;
  flex-wrap: wrap;
  gap: 12px;
`

export const MirrorScreen = styled.div`
   position: absolute;
   width:100%;
   height:110vh;
   top:0;
   z-index:1;
   opacity:0.6;
   background:${colors.black.light};
   display:${props=>props.showModal ? "flex": "none"};
   align-items:center;
   justify-content:center;
   @media(max-width:1200px){
    height:120vh;
   }
   @media(max-width:850px){
    height:150vh;
   }
`

export const Modal = styled.form`
  display:${props=>props.showModal ? "flex": "none"};
  flex-direction:column;
  gap: 24px;
  z-index:2;
  position:absolute;
  border-radius: 16px;
  opacity:1;
  padding:16px;
  background:${colors.gray.light};
  width:500px;
  height:250px;
  align-items:center;
  justify-content:center;

`

export const Close = styled.div`
  position:absolute;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:800;
  background:${colors.gray.light};
  cursor:pointer;
  // @media(max-width:650px){
    height:20px;
    width:20px;
    top:18px;
    right:18px;
    font-size: 12px;
  // }
`

export const WorkspaceContainer = styled.div`
   display:flex;
   gap: 12px;
   flex-direction:column;
   h3{
    font-size: 18px;
    font-weight:600;
   }
`

export const TitleContainer = styled.div`
  display:flex;
  width:100%;
  justify-content: space-evenly;
  align-items:center;
  margin-bottom: 24px;
`
export const StyleBiTrashAlt = styled(BiTrashAlt)`
  color:${colors.primary.medium};
  scale:1.5;
  cursor:pointer;
`
export const WorkspaceTitleContainer = styled.div`
  display:flex;
  padding-right: 36px;
  justify-content: space-between;
`
