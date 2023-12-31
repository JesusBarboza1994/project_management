import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.div`
  width:100%;
  display:flex;
  background: ${colors.background.light};
  color:${colors.font.title};
  padding: 1.5rem 2rem;
  align-items: center;
  justify-content: space-between;
  div{
    display: flex; 
    gap: 1rem;
  }
  h1{
    cursor: pointer;
  }
`