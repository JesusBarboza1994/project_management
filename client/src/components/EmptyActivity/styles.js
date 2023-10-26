import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.form`
  display:flex;
  justify-content:space-between;
  // align-items:center;
  background:${colors.background.blank};
  width: 100%;
  padding: 4px 16px;
  gap: 8px;
  border-radius:12px;
  border: 2px dashed ${colors.primary.light};
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  p{
    color: ${colors.font.text}
  }
  input[type="text"]{
    width: 200px;
    border-radius: 5px;
    border:none;
    height: 28px;
    background:${colors.background.blank};
  }
  input[type="number"]{
    width: 50px;
    border-radius: 5px;
    border:none;
    height: 28px;
    font-size:14px;
    padding: 0 5px;
    background:${colors.background.blank};
  }
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
  @media(max-width: 640px){
    flex-direction:column;
    align-items:flex-start;
  }
`
export const Container = styled.div`
  display:flex;
  gap: 4px;
  align-items:center;
  input{
    padding: 2px 6px;
  }
`