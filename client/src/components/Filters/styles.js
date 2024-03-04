import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.div`
  display:flex;
  flex-direction:column;
  padding-bottom: 2rem;
  gap:12px;
`
export const FilterWrap = styled.div`
  display:flex;
  gap: 20px;
  flex-wrap: wrap;
`

export const FilterDiv = styled.div`
  width: 200px;
  border: 1px solid ${colors.background.highlight};
  padding: 6px;
  border-radius: 8px;
  display: flex;
  flex-direction:column;
  label,{
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 600;
  },
  span{
    font-size: 14px;
    font-weight: 500;
  },
  //  input[type="range"]::-webkit-slider-runnable-track{
  //   background:${colors.primary.highlight};
  //   height:6px;
  //   border-radius: 6px;
  // },
    
`
export const Select = styled.select`
  width: 100%;
  border: none; /* Elimina el borde */
  appearance: none; /* Elimina la apariencia predeterminada */
  -webkit-appearance: none; /* Para navegadores webkit */
  -moz-appearance: none; 
  padding-left: 6px;
  font-size: 12px;
  color: ${colors.font.text};
  option {
    &:hover{
      background-color: red; /* Cambia el color de fondo a rojo */
    }
  
  }
`

export const ExcelButton = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 16px;
  cursor:pointer;
  p{
    font-size:14px;
  }
  &:hover{
    border: 1px solid green;
  }
`