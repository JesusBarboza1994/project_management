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
  @media(max-width: 640px){
    font-size: 14px;
  }
  `
  export const MainContainer = styled.div`
  width:80%;
  background:${colors.background.light};
  border-radius: 20px;
  padding: 24px;
  @media(max-width: 1024px){
    width:90%;
  }
  @media(max-width: 768px){
    width:95%;
  }

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
  flex-wrap:wrap;
  justify-content: space-between;
  div{
    display: flex;
    gap:12px;
    align-items:center;
  }
  #projectName input{
    border:none;
    color: ${colors.font.title};
    font-weight: 600;
    max-width:120px;
    text-transform: uppercase;
    padding: 2px 6px;
    background:${colors.background.light};
  }
  @media(max-width: 640px){
    flex-direction:column;
    >div{
      justify-content:space-between;
      width:100%;
    }
  }
`
