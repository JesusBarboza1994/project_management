import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Row = styled.tr`
  // display: flex;
  // align-items: center;
  // justify-content: space-between;
  padding: 10px; 
  width:100%;
  background: ${props=>props.index%2 !== 0 ? colors.background.light : colors.background.dark};
  border-bottom: 1px solid ${colors.background.highlight};
  td{
    padding-left: 8px;
  }
`

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  width: 100%;
  padding: 10px;
  // overflow-x: auto;
`

export const TableData = styled.table`
  width: 100%;
  border-collapse: collapse;
  thead{
    border-bottom: 2px solid ${colors.background.light};
  }
  td{
    font-size:12px;
    text-align:center;
    border: none;
  }
  
`