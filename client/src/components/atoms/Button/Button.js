import { colors } from "../../../styles";
import { StyledButton } from "./styles";

export function Button({text, onClick, type, Icon}){
	let background;
	let border;
	let color;
	let colorHover;
	let borderHover;
	if(type==="outline"){
		background = colors.background.blank;
		border = colors.primary.light;
		color = colors.font.title
		colorHover = colors.primary.light;
		borderHover = colors.primary.highlight;
	}else if(type==="solid"){
		background = colors.primary.medium;
		border = colors.primary.medium;
		color = colors.font.white;
		colorHover = colors.primary.light;
		borderHover = colors.primary.highlight;
	}else if(type==="secondary"){
		background = colors.white;
		border = colors.white
		color = colors.tertiary.dark
		borderHover = colors.tertiary.dark;
	}
	return(
			<StyledButton
				onClick={onClick} borderHover={borderHover} colorHover={colorHover} background={background} border={border} color={color}>
				{Icon}
				{text}
			</StyledButton>
	)
}
