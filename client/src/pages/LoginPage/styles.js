import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.div`
  margin:auto;
  margin-top:100px;
  width:360px;
  background:${colors.gray.light};
  padding: 32px;
  border-radius:24px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap: 16px;
  h1{
    font-size:28px;
    text-align:center;
  }
`

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  p{
    font-size: 18px;
    font-weight: 600;
    color:${colors.black.light};
  }
`