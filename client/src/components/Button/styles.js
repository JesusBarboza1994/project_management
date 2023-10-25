import styled from "@emotion/styled";
import { colors } from "../../styles";

export const StyledButton = styled.button`
	display:flex;
	flex-direction:row;
	justify-content: center;
	align-items: center;
	padding:8px 1.5rem;
	gap: 8px;
	color: ${colors.white};
	border-radius: 16px;
	cursor:pointer;
	color: ${(props) => props.color};
	background: ${(props) => props.background};
	border: ${(props) => `1px solid `+props.border|| 'none'};
  &:hover{
    background: ${(props) => props.colorHover};
		color: ${colors.font.white};
    border: ${(props) => `1px solid `+props.borderHover|| 'none'};
  }
`
