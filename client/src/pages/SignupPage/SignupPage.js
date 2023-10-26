import { useState } from "react";
import Input from "../../components/Input/Input";
import { Container, Error, Wrapper } from "./styles";
import Button from "../../components/Button";
import { signUp } from "../../services/user-service";
import { useNavigate } from "react-router-dom";

export function SignupPage(){
  const [data, setData] = useState({
    username: "",
    email:"",
    password: "",
  })
  const [error, setError] = useState(null)
  const nav = useNavigate()
  const handleSignUp = (e) => {
    e.preventDefault()
    signUp(data).then(res => {
      console.log(res)
      nav("/")
    }).catch(err => {
      console.log(err)
      setError("Correo ya se encuentra registrado")
    })
  }
  return(
    <Wrapper>
      <Container onSubmit={(e)=>handleSignUp(e)}>
        <h2>Sign Up</h2>
        <Input 
          type="text" 
          label="Username" 
          placeholder="Username" 
          value={data.username}
          onChange={(e) => setData({...data, username: e.target.value})}
        />
        <Input
          type="text"
          label="Email"
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData({...data, email: e.target.value})}
        />
        <Input
          type="password"
          label="Password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => setData({...data, password: e.target.value})}
        />
        {error && <Error>{error}</Error>}
        <Button type="solid" text={"Sign Up"}/>
        <input type="submit" value={""} hidden/>
      </Container>
    </Wrapper>
  )
}