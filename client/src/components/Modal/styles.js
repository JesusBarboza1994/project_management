import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.form`
  display:${props=>props.showModal ? "flex": "none"};
  flex-direction:column;
  gap: 16px;
  z-index:2;
  position:absolute;
  border-radius: 16px;
  opacity:1;
  padding:16px;
  background:${colors.background.light};
  width:500px;
  // height:250px;
  align-items:center;
  justify-content:center;
  h2{
    text-align:center;
  }
`
export const Close = styled.div`
  position:absolute;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:800;
  background:${colors.background.light};
  cursor:pointer;
  // @media(max-width:650px){
    height:20px;
    width:20px;
    top:18px;
    right:18px;
    font-size: 12px;
  // }
`
export const MirrorScreen = styled.div`
   position: absolute;
   width:100%;
   height:110vh;
   top:0;
   z-index:1;
   opacity:0.6;
   background:${colors.background.medium};
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