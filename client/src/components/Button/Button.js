import { colors, typography } from "../../styles"
import { StyledButton } from "./styles";

export function Button({text, onClick, type, Icon}){
	let background;
	let border;
	let color;
	let colorHover;
	let borderHover;
	if(type==="outline"){
		background = colors.white;
		border = colors.red.light;
		color = colors.black.dark
		colorHover = colors.red.light;
		borderHover = colors.red.highlight;
	}else if(type==="solid"){
		background = colors.red.medium;
		border = colors.red.medium;
		color = colors.white;
		colorHover = colors.red.light;
		borderHover = colors.red.highlight;
	}else if(type==="secondary"){
		background = colors.white;
		border = colors.white
		color = colors.gray.dark
		borderHover = colors.gray.dark;
	}
	return(
			<StyledButton
				onClick={onClick} borderHover={borderHover} colorHover={colorHover} background={background} border={border} color={color}>
				{Icon}
				{text}
			</StyledButton>
	)
}
