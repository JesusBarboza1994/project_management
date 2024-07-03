import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.div`
`

export const ActivityDiv = styled.div`
  background: ${props => props.colorValue ? colors.randomColors[props.colorValue] : colors.primary.medium};
  border-radius: 8px;
  height: 12px;
  display: flex;
  justify-content: flex-start;
  p{
    font-size: 8px;
  }
`

export const Row = styled.div`
`

export const ModalDate = styled.div`
  position:absolute;
  // height:30px;
  width:100px;
  display:flex;
  flex-direction:column;
  align-items: flex-start;
  justify-content:center;
  background:${colors.background.blank};
  border-radius:8px;
  padding: 2px 8px;
  z-index:2;
  p{
    margin:0;
    padding:0;
    line-height:10px;
    font-size:8px;
  }
`
