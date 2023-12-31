import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  height:90px;
  width: 180px;
  border-radius:12px;
  border: 2px dashed ${colors.primary.light};
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  &:hover{
    scale: 1.05;
  }
`