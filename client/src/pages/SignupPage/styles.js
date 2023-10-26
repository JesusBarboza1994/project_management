import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content: center;
  padding-top: 80px;
`

export const Container = styled.form`
  background:${colors.background.light};
  border-radius: 20px;
  display:flex;
  flex-direction:column;
  gap:12px;
  padding: 24px;
  max-width: 600px;
  h2{
    width: 100%;
    text-align:center;
  }
  
`
export const Error= styled.p`
  color:${colors.font.danger};

`