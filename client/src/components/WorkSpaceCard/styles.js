import styled from "@emotion/styled";

export const Wrapper = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  height:80px;
  width: 120px;
  padding: 8px;
  border-radius:12px;
  background-color:${props => props.backgroundColor};
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  p{
    color:black;
    text-align:center;
    font-size:14px;
    font-weight: 600;
  }
  &:hover{
    scale: 1.05;
  }
`