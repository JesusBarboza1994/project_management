import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { listProjects } from "../../services/project-service";
import { Wrapper } from "./styles";

export default function WorkSpaceCard({workspaceName, backgroundColor, id}){
  const {setCurrentWorkspace} = useAuth()
  const nav = useNavigate()
  const handleShowWorkspace = () => {
    setCurrentWorkspace({
      name: workspaceName,
      id
    })
    nav(`/projects`)
  }

  return(
    <Wrapper backgroundColor={backgroundColor} onClick={handleShowWorkspace}>
      <p>{workspaceName}</p>
    </Wrapper>
  )
}