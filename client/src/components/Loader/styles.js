import styled from "@emotion/styled";
import { keyframes } from '@emotion/react';
import { colors } from "../../styles";
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
`
export const Load = styled.div`
  border: 6px solid ${colors.background.highlight}; /* Gris claro */
  border-top: 6px solid ${colors.primary.highlight}; /* Azul */
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: ${spin} 1s linear infinite; /* Animación de rotación */
`
