import { Wrapper } from "./styles";

export default function Input({label, placeholder, type, onChange}){
  return(
    <Wrapper>
      {label && <p>{label.toUpperCase()}</p>}
      <input type={type} placeholder={placeholder} onChange={onChange}/>
    </Wrapper>
  )
}