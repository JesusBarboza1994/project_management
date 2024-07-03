import { useState } from "react";
import Input from "../../components/Input/Input";
import { Container, Error, Wrapper } from "./styles";
import {Button} from "../../components/atoms/Button/Button";
import { signUp } from "../../services/user-service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

export function SignupPage(){
  const {user, setUser }= useAuth()
  const [data, setData] = useState({
    username: "",
    email:"",
    password: "",
  })
  const [error, setError] = useState(null)
  const nav = useNavigate()
  const handleSignUp = async (e) => {
    e.preventDefault()
    console.log("🚀 ~ handleSignUp ~ data:", data)
    try {
      const res = await signUp(data)
      setUser({...user, username: res})
      setError(null)
      sessionStorage.setItem("user", JSON.stringify({username: res.username}))
      nav("/")
    } catch (error) {
        console.log(error)
        setError("Correo ya se encuentra registrado")
      
    }

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
          onChange={(e) => {
            setData({...data, username: e.target.value})
            if(error) setError(null)
            }
          }
        />
        <Input
          type="text"
          label="Email"
          placeholder="Email"
          value={data.email}
          onChange={(e) => {
            setData({...data, email: e.target.value})
            if(error) setError(null)
            }
          }
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