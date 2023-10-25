import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.div`
  width: 100%;
  padding-top: 60px;
  position:relative;
  min-height: 200px;
  display:flex;
  flex-direction:column;
  align-items:center;
  `
  export const MainContainer = styled.div`
  width:80%;
  background:${colors.background.light};
  border-radius: 20px;
  padding: 24px;
  

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
