import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.div`
  width: 200px;
  border-radius:20px;
  border:1px solid ${colors.white};
  display:flex;
  background: ${colors.red.light};
  align-items:center;
  justify-content:center;
  padding: 16px 32px;
  cursor:pointer;
  p{
    font-size:20px;
    font-weight: 500;
    color:${colors.black.dark};
  }
  &:hover{
    background: ${colors.red.highlight};
    p{
      color:${colors.white};
    }
}
`
  
