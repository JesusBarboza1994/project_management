import styled from "@emotion/styled";
import { colors } from "../../styles";
import { BiTrashAlt } from "react-icons/bi";

export const Wrapper = styled.div`
  width: 80%;
  margin:auto;
  margin-top: 60px;
  min-height: 200px;
  padding: 24px;
  background:${colors.background.blank};
  border-radius: 20px;
  display:flex;
  flex-direction:column;
  align-items:center;
  @media(max-width:640px){
    width:90%;
  }
`

export const Container = styled.div`
  margin-top: 16px;
  display:flex;
  width:100%;
  flex-wrap: wrap;
  justify-content: flex-start;
  flex-direction:column;
  gap:24px;
`

export const ProjectContainer = styled.div`
  display:flex;
  flex-wrap: wrap;
  gap: 12px;
`

export const WorkspaceContainer = styled.div`
  display:flex;
  gap: 12px;
  flex-direction:column;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.tertiary.dark};
  h3{
  font-size: 18px;
  font-weight:600;
  }
  h2{
    text-transform: uppercase;
  }
`

export const TitleContainer = styled.div`
  display:flex;
  width:100%;
  justify-content: space-evenly;
  gap:12px;
  align-items:center;
  margin-bottom: 24px;
  text-transform: uppercase;
  text-align:center;
`
export const StyleBiTrashAlt = styled(BiTrashAlt)`
  color:${colors.primary.medium};
  scale:1.5;
  cursor:pointer;
`
export const WorkspaceTitleContainer = styled.div`
  display:flex;
  padding-right: 36px;
  justify-content: space-between;
  input{
    border:none;
    color: ${colors.font.title};
    font-weight: 600;
    text-transform: uppercase;
    padding: 2px 6px;
  }
  text-transform: uppercase;
`
export const List = styled.ul`
  width:100%;
  display: flex;
  background: ${colors.background.blank};
  border-radius: 8px;
  flex-direction:column;
  justify-content: flex-start;
  padding: 8px;
  flex-wrap: wrap;
  margin:0;
  li{
    list-style: none;
    width: 100%;
    border-radius: 6px;
    padding-left: 6px;
    font-size: 12px;
    &:hover{
      background: ${colors.primary.highlight};
      color:${colors.background.blank};
    }
    &:focus{
      background: ${colors.primary.light};
    }
  }
`

export const SharedUserDiv = styled.div`
  display:flex;
  justify-content: space-between;
  width: 100%;
  padding: 4px 16px;
  font-size: 12px;
  border-radius: 8px;
  border: 1px solid ${colors.tertiary.dark};
`
export const Select = styled.select`
  width: 100px;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 8px;
  border: 1px solid ${colors.tertiary.dark};
`