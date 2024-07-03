import { Triangle, Wrapper } from "./styles";

export default function Information({text, showInfo}) {
  return (
    <Wrapper showInfo={showInfo}>
      <p>{text}</p>
      <Triangle/>
    </Wrapper>
  )
}