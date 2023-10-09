import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  height:40px;
  width: 100%;
  padding: 4px 16px;
  gap: 8px;
  border-radius:12px;
  border: 2px dashed ${colors.red.light};
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  p{
    color: ${colors.gray.medium}
  }
  div{
    display:flex;
    gap: 4px;
    align-items:center;
  }
  input[type="text"]{
    width: 200px;
    border-radius: 5px;
    border:none;
    height: 28px;
  }
  input[type="number"]{
    width: 50px;
    border-radius: 5px;
    border:none;
    height: 28px;
    font-size:14px;
    padding: 0 5px;
  }
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
`