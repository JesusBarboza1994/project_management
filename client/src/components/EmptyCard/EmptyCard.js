import { colors } from "../../styles";
import { Wrapper } from "./styles";
import { IoAddOutline } from "react-icons/io5";

export default function EmptyCard({onClick, text}){
  return(
    <>
    <Wrapper onClick={onClick}>
      {text}
      <IoAddOutline style={{width: '30', height: '30', color: colors.icon.primary} }/>
      {text}
    </Wrapper>
    </>
  )
}