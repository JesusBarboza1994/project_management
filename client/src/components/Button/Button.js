import { Wrapper } from "./styles";

export default function Button({text, textColor, onClick}){
  return(
      <Wrapper style={{color: textColor}} onClick={onClick}>
          <p>{text}</p>
      </Wrapper>
  )
}