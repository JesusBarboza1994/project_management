import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.div`
width: 200px;
border-radius:20px;
border:6px solid ${colors.white};
display:flex;
align-items:center;
justify-content:center;
padding: 16px 32px;
cursor:pointer;
p{
  font-size:24px;
  font-weight: 700;
  color:white;
}
&:hover{
  scale:1.05;
  border:6px solid ${colors.red.highlight};
}
`
  
