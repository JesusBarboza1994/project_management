import styled from "@emotion/styled";
import { colors } from "../../styles";

export const Wrapper = styled.div`
  display:flex;
  justify-content: space-between;
  align-items:center;
  flex-direction: column;
  // height:40px;
  width: 100%;
  padding: 4px 16px;
  padding-bottom: 8px;
  gap: 6px;
  border-radius:12px;
  border: 1px solid ${colors.secondary.light};
  background: ${ props => props.color };
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  p{
    color: ${colors.font.title}
  }
  .progress-weight, .activity-name{
    display: flex;
    align-items:center;
    justify-content: space-between;
  }
  >div{
    width:100%;
  }
  #activityname{
    border:none;
    color: ${colors.font.title};
    font-weight: 500;
    padding: 2px 6px;
    background:${ props => props.color };;
  }
  @media(max-width: 640px){
    input[type="date"]{
      font-size: 10px;
    }
  }
`
export const SubContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: space-between;
  .hidden-desktop{
    display:none;
  }
  >div{
    display:flex;
    align-items: center;
  }
  .progress-weight{
    width:100%;
  }
  @media(max-width: 1024px){
    flex-direction:column;
    justify-content:flex-start;
    .hidden-desktop{
      display:block;
    }
    .hidden-mobile{
      display:none;
    }
    >div{
      justify-content:space-between;
      width:100%;
    }
  }
  @media(max-width: 768px){
    .progress-weight{
      flex-direction:column;
      >div{
        width:100%;
        justify-content:flex-start;
        gap: 12px;
      }
    }
  }
`
// export const TitleContainer = styled.div`
//   display:flex;
//   align-items:center;
//   p{
//     text-align: center
//   }
// `
export const SubActivitiesContainer = styled.div`
  display:flex;
  align-items:center;
  flex-direction:column;
  margin-left: 0px;
  gap: 8px;
  width:100%;
  
`
export const DataContainer = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  flex-wrap:wrap;
  p{
    font-size: 12px;
  }
  div{
    display:flex;
    align-items:center;
    justify-content: center;
  }
  input{
    width: 40px;
    border-radius: 5px;
    border:none;
    font-size: 12px;
    height: 28px;
    font-size:16px;
    padding: 0 5px;
    background:${props=>props.color};
  }
  input[type="date"]{
    width: 100px;
    border-radius: 5px;
    border:none;
    height: 28px;
    font-size:12px;
    padding: 0 5px;
    background:${props=>props.color};
  }
  &:placeholder input{
    background:${colors.white};
  }
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
`
export const RelativeAbsoluteContainer = styled.div`
  display: flex;
  // justify-content: space-between;
  @media(max-width: 1400px){
    flex-direction:column;
    gap:2px;
  }
`