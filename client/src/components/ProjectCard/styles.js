import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.div`
  display:flex;
  flex-direction:column-reverse;
  justify-content:flex-end;
  gap: 2px;
  position:relative;
  border: 1px solid ${colors.black.light};
  align-items:center;
  height:90px;
  width: 180px;
  padding: 8px;
  padding-top:4px;
  z-index:1;
  border-radius:12px;
  background-color:${props => props.backgroundColor};
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  p{
    color:black;
    text-align:center;
    font-size:14px;
    font-weight: 600;
  }
  &:hover{
    scale: 1.05;
  }
`
