import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.div`
  width: 80%;
  margin:auto;
  margin-top: 60px;
  min-height: 200px;
  padding: 24px;
  background:${colors.gray.highlight};
  border-radius: 20px;
`

export const Container = styled.div`
  display:flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`
export const TitleContainer = styled.div`
  display:flex;
  gap: 8px;
  align-items:center;
  justify-content: space-between;
  div{
    display: flex;
    gap:12px;
    align-items:center;
  }
`
