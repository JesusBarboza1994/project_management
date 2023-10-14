import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.div`
  position: absolute;
  max-width:200px;
  background:${colors.white};
  top:-35px;
  display:${props=> props.showInfo ? 'flex': 'none'};
  right:0px;
  padding:4px;
  border-radius:8px 8px 8px 0;
  p{
    font-size:8px;
  }
`
export const Triangle = styled.div`
position: absolute;
width: 0;
height: 0;
border-left: 0px solid transparent;
border-right: 15px solid transparent;
border-top: 15px solid ${colors.white};
top: 80%;
left: 6%;
transform: translateX(-50%);
`;