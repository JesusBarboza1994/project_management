
import { useEffect } from "react";
import Button from "../Button";
import Input from "../Input/Input";
import { Close, MirrorScreen, Wrapper } from "./styles";
export function Modal(props){
  const {title, type, label, placeholder, onChange, onClick, showModal, onSubmit,text, typeButton, setShowModal} = props
 
  useEffect(()=>{
    const handleEscKeyPress = (event) => {
      if (event.keyCode === 27 && showModal) {
        setShowModal(false);
      }
    };

    // Agrega el oyente de eventos cuando el componente se monta
    document.addEventListener('keydown', handleEscKeyPress);

    // Elimina el oyente de eventos cuando el componente se desmonta
    return () => {
      document.removeEventListener('keydown', handleEscKeyPress);
    };
  })
  return(
    <>
      <Wrapper showModal={showModal} onSubmit={onSubmit}>
        <h2>{title}</h2>
        {
          type &&
          <Input type={type} label={label} placeholder={placeholder} onChange={onChange} />
        }
        {props.children}
        <Button text={text} type={typeButton}/>
        <Close onClick={onClick}>X</Close>
      </Wrapper>
      <MirrorScreen showModal={showModal}>
        
      </MirrorScreen>
    </>
  )
}