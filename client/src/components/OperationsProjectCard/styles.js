import styled from "@emotion/styled"
import { colors } from "../../styles"
import {IoColorPaletteOutline} from "react-icons/io5"

export const ColorsContainer=styled.div`
  padding: 6px;
  display:${props=>props.showColors ? 'grid': 'none'};
  border: 1px solid ${colors.secondary.light};
  border-radius:12px;
  z-index:2;
  row-gap:2px;
  column-gap: 2px;
  grid-template-rows:repeat(2,1fr);
  grid-template-columns:repeat(4,1fr);
  background:${colors.white};
  position: absolute;
  top:-40px;
`
export const EachColor = styled.div`
  height:16px;
  width:16px;
  border-radius:50%;
  background-color:${props => props.color};
`
export const IconContainer = styled.div`
  // position:absolute;
  display:flex;
  z-index:2;
  justify-content:center;
  align-items:center;
  padding:4px;
  // top: 5px;
  // right: ${props=>props.right};
  background:${colors.background.light};
  border-radius: 50%;
  &:hover{
    background:${colors.background.light};
  }
`
export const StyleColorPalette = styled(IoColorPaletteOutline)`
  &:hover{
  }
`
export const IconsContainer = styled.div`
  display:flex;
  flex-direction:row-reverse;
  justify-content:flex-start;
  align-items:center;
  gap: 6px;
  width:100%;
`