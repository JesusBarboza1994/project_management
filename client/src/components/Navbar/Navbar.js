import { useNavigate } from "react-router-dom";
import { Icons } from "../../utils";
import { Wrapper } from "./styles";
import Button from "../Button";

export function Navbar(){
  const nav = useNavigate()
  const url = window.location.href.split("/")
  return(
    <Wrapper>
      <h1 onClick={()=>nav("/")}>PROMA</h1>
      <div>
        
        {
          sessionStorage.getItem("token") ? 
          <Button text="Logout" type="solid" Icon={Icons.logoutCircle} onClick={()=>{
            sessionStorage.removeItem("token")
            nav("/")
          }}/>
          :
            (url[3] === "signup") ?
            <Button text="Login" type="outline" Icon={Icons.login} onClick={()=>nav("/")}/>
            :
            <Button text="Signup" type="outline" Icon={Icons.userReceived} onClick={()=>nav("/signup")}/>
          
        }
      </div>
    </Wrapper>
  )
}