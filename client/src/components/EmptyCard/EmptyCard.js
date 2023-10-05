import { useAuth } from "../../context/auth-context";
import { colors } from "../../styles";
import { Wrapper } from "./styles";
import { IoAddOutline } from "react-icons/io5";

export default function NewComponent(){
  const {setShowModal} = useAuth()
  const handleNewWorkspace = () => {
    setShowModal(true)
  }

  return(
    <>
    <Wrapper onClick={handleNewWorkspace}>
      <IoAddOutline style={{width: '30', height: '30', color: colors.red.medium} }/>
    </Wrapper>
    </>
  )
}