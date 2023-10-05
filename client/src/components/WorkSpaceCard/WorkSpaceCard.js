import { Wrapper } from "./styles";

export default function WorkSpaceCard({workspaceName, backgroundColor, id}){
  const handleShowWorkspace = () => {
    
  }

  return(
    <Wrapper backgroundColor={backgroundColor} onClick={handleShowWorkspace}>
      <p>{workspaceName}</p>
    </Wrapper>
  )
}