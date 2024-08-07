import { useState } from "react";
import Button from "../../components/atoms/Button";
import Input from "../../components/Input/Input";
import { ErrorText, Wrapper } from "./styles";
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
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value
    }));
    if(error) setError(null)
  };
  const handleSubmit = (e) => {
    e.preventDefault()
    login(credentials).then(res => {
      console.log(res)
      if(res.errors){
        setError(res.errors)
        return
      }
      setUser({...user, username: res.user.username})
      sessionStorage.setItem("user", JSON.stringify({username: res.user.username}))
      nav("/workspaces")
    }).catch(err => {
      console.log(err)
      setError(true)
    })
  }

  return(
    <div>
      <Wrapper onSubmit={(e)=>handleSubmit(e)}>
        <h1>Project Management</h1>
          <Input onChange={(e)=>handleChange(e)} name={"email"} label={"Email"} type={"email"} placeholder={"john_doe@mail.com"} value={credentials.email}/>
          <Input onChange={(e)=>handleChange(e)} name={"password"} label={"Password"} type={"password"} placeholder={"******"} value={credentials.password}/>
        {error && <ErrorText>Usuario y contraseña inválidos</ErrorText>}
        <Button text={"Login"} type={"solid"}/>
        <input type="submit" value={""} hidden/>
      </Wrapper>
    </div>
  )
}