import { Wrapper } from "./styles";

export default function Button({text, textColor, onClick}){
  return(
      <Wrapper onClick={onClick} type="submit" value={text}/>
  )
}