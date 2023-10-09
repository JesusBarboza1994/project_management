import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.div`
  display:flex;
  justify-content: space-between;
  align-items:center;
  height:40px;
  width: 100%;
  padding: 4px 16px;
  gap: 8px;
  border-radius:12px;
  border: 1px solid ${colors.black.light};
  background: ${colors.pink.light};
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  p{
    color: ${colors.black.dark}
  }
`
export const TitleContainer = styled.div`
  display:flex;
  align-items:center;
`
export const SubActivitiesContainer = styled.div`
  display:flex;
  align-items:center;
  flex-direction:column;
  margin-left: 12px;
  gap: 8px;
  width:100%;
`
