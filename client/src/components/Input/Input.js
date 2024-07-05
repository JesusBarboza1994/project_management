import { Wrapper } from "./styles";

export default function Input({label, placeholder, type, onChange, name, value }){
  return(
    <Wrapper>    
      {label && <p>{label.toUpperCase()}</p>}
      <input type={type} placeholder={placeholder} onChange={onChange} name={name} value={value}/>
    </Wrapper>
  )
}