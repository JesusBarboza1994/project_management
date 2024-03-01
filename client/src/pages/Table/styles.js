import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px; 
  border-bottom: 1px solid ${colors.background.highlight};
`

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  padding: 10px;
  overflow-x: auto;
`