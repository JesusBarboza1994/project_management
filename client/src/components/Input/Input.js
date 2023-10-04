import { Wrapper } from "./styles";

export default function Input({label, placeholder, type}){
  return(
    <Wrapper>
      <p>{label.toUpperCase()}</p>
      <input type={type} />
    </Wrapper>
  )
}