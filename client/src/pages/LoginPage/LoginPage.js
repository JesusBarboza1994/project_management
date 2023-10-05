import { useState } from "react";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { ErrorText, InputContainer, Wrapper } from "./styles";
import { login } from "../../services/session-service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
export default function LoginPage(){
  const nav = useNavigate()
  const {user, setUser} = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState(null)

  const handleSubmit = () => {
    login(credentials).then(res => {
      console.log(res)
      setError(null)
      setUser({...user, username: res})
      nav("/workspaces")
    }).catch(err => {
      console.log(err)
      setError(true)
    })
  }
  

  return(
    <Wrapper>
      <h1>Project Management</h1>
      <InputContainer>
        <Input onChange={(e) => setCredentials({...credentials, email: e.target.value})} label={"Email"} type={"email"} placeholder={"john_doe@mail.com"} value={credentials.email}/>
        <Input onChange={(e) => setCredentials({...credentials, password: e.target.value})} label={"Password"} type={"password"} placeholder={"******"} value={credentials.password}/>
      </InputContainer>
      {error && <ErrorText>Usuario y contraseña inválidos</ErrorText>}
      <Button text={"Login"} onClick={handleSubmit}/>
    </Wrapper>
  )
}