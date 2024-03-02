import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Row = styled.tr`
  // display: flex;
  // align-items: center;
  // justify-content: space-between;
  padding: 10px; 
  width:100%;
  border-bottom: 1px solid ${colors.background.highlight};
`

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  width: 100%;
  padding: 10px;
  overflow-x: auto;
  margin-left: 2rem;
  overflow-x: auto;
`

export const TableData = styled.table`
  width: 100%;
  td{
    font-size:12px;
    text-align:center;
  }
`