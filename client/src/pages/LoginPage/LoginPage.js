
import { useState } from "react";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { InputContainer, Wrapper } from "./styles";
import { login } from "../../services/session-service";

export default function LoginPage(){
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = () => {
    console.log(credentials)
    login(credentials)
  }

  return(
    <Wrapper>
      <h1>Project Management</h1>
      <InputContainer>
        <Input onChange={(e) => setCredentials({...credentials, email: e.target.value})} label={"Email"} type={"email"} placeholder={"john_doe@mail.com"} value={credentials.email}/>
        <Input onChange={(e) => setCredentials({...credentials, password: e.target.value})} label={"Password"} type={"password"} placeholder={"******"} value={credentials.password}/>
      </InputContainer>
      <Button text={"Login"} onClick={handleSubmit}/>
    </Wrapper>
  )
}