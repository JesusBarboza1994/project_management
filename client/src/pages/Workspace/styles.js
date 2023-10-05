import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.div`
  width: 80%;
  margin:auto;
  margin-top: 60px;
  min-height: 200px;
  padding: 24px;
  background:white;
  border-radius: 20px;
`

export const Container = styled.div`
  margin-top: 16px;
  display:flex;
  justify-content: flex-start;
  gap:1rem;
`

export const MirrorScreen = styled.div`
   position: absolute;
   width:100%;
   height:120vh;
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

export const Modal = styled.div`
  display:${props=>props.showModal ? "flex": "none"};
  position:absolute;
  top:0;
  width:100%;
  height:100%;
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