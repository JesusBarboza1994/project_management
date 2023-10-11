import { BiSolidDownArrow, BiSolidRightArrow, BiTrashAlt } from "react-icons/bi";
import { DataContainer, RelativeAbsoluteContainer, SubActivitiesContainer, TitleContainer, Wrapper } from "./styles";
import { useEffect, useRef, useState } from "react";
import { colors } from "../../styles";
import { deleteActivity, listActivities } from "../../services/activity-service";
import { useAuth } from "../../context/auth-context";
import EmptyActivity from "../EmptyActivity/EmptyActivity";

export default function ActivityCard({activity}){
  const [subActivities, setSubActivities] = useState(null)
  const {setUpdateListActivities, updateListActivites, updateSubActivities, setUpdateSubActivities} = useAuth()
  const ejecutarEfectoRef = useRef(false);
  const [activityData, setActivityData] = useState({
    absoluteWeight: activity.absolute_weight,
    relativeWeight: activity.relative_weight,
    relativeProgress: activity.relative_progress,
    absoluteProgress: activity.absolute_progress
  })
  const handleSubActivities = () => {
    ejecutarEfectoRef.current = true;
    setUpdateSubActivities(!updateSubActivities)
  }

  const handleDeleteActivity = () => {
    deleteActivity(activity._id).then(res => {
      console.log(res)
      setUpdateListActivities(!updateListActivites)
      setUpdateSubActivities(!updateSubActivities)
    }).catch(err => {
      console.log(err)
    })
  }
  useEffect(() => {
    if (ejecutarEfectoRef.current){
      listActivities(activity._id).then(res => {
        console.log(res)
        setSubActivities(res.activities)
      }).catch(err => {
        console.log(err)
      })
    }
  },[updateSubActivities])

  const color = Object.values(colors.randomColors)[activity.index]
  return(
    <>
      <Wrapper color={color}>
          {subActivities 
            ? 
            <TitleContainer onClick={()=> setSubActivities(null)}>
              <BiSolidDownArrow/>
              <p>{activity.description}</p>
            </TitleContainer>
            : 
            <TitleContainer onClick={handleSubActivities}>
              <BiSolidRightArrow/>
              <p>{activity.description}</p>
            </TitleContainer>
          }
        <RelativeAbsoluteContainer>
          <DataContainer color={Object.values(colors.randomColors)[activity.index]}>
            <p>Peso Relativo: </p>
            <div style={{display:"flex"}}>
              <input type={"number"} value={(activityData.relativeWeight*100).toFixed(2)} onChange={(e) => {
                setActivityData({...activityData,relativeWeight: (+e.target.value)/100})
              }}/>
              <p>%</p>
            </div>
          </DataContainer>
          <DataContainer>
            <p>Peso Absoluto: </p>
            <p>{(activityData.absoluteWeight*100).toFixed(2)}%</p>
          </DataContainer>
        </RelativeAbsoluteContainer>
        <RelativeAbsoluteContainer>
          <DataContainer color={Object.values(colors.randomColors)[activity.index]}>
            <p>Progreso Relativo: </p>
            <div style={{display:"flex"}}>
              <input type={"number"} value={(activityData.relativeProgress*100).toFixed(2)} onChange={(e) => {
                setActivityData({...activityData,relativeProgress: (+e.target.value)/100})
              }}/>
              <p>%</p>
            </div>
          </DataContainer>
          <DataContainer>
            <p>Progreso Absoluto: </p>
            <p>{(activityData.absoluteProgress*100).toFixed(2)}%</p>
          </DataContainer>
        </RelativeAbsoluteContainer>
        <BiTrashAlt onClick={handleDeleteActivity} style={{color:colors.red.dark, scale: "1.1"}}/>
      </Wrapper>
      {
        subActivities &&
        <SubActivitiesContainer>
          {
            subActivities.map(subactivity =>{
              return(
                <ActivityCard key={subactivity._id} activity={subactivity}/>
              )
            })
          }
          <EmptyActivity parent={activity._id}/>
        </SubActivitiesContainer>
      }
    </>
  )
}