import { BiSolidDownArrow, BiSolidRightArrow, BiTrashAlt } from "react-icons/bi";
import { DataContainer, RelativeAbsoluteContainer, SubActivitiesContainer, TitleContainer, Wrapper } from "./styles";
import { useEffect, useRef, useState } from "react";
import { colors } from "../../styles";
import { deleteActivity, listActivities, updateActivity } from "../../services/activity-service";
import { useAuth } from "../../context/auth-context";
import EmptyActivity from "../EmptyActivity/EmptyActivity";

export default function ActivityCard({activity, editProjectPermission}){
  const [subActivities, setSubActivities] = useState(null)
  const {setUpdateListActivities, updateListActivites, updateSubActivities, setUpdateSubActivities, setCurrentProject, currentProject} = useAuth()
  const ejecutarEfectoRef = useRef(false);
  const [activityData, setActivityData] = useState({
    absoluteWeight: activity.absolute_weight,
    relativeWeight: activity.relative_weight,
    relativeProgress: activity.relative_progress,
    absoluteProgress: activity.absolute_progress,
    relativeWeightPercentage: activity.relative_weight_percentage,
  })
  const handleSubActivities = () => {
    ejecutarEfectoRef.current = true;
    setUpdateSubActivities(!updateSubActivities)
  }

  const handleDeleteActivity = () => {
    deleteActivity(activity._id).then(res => {
      const updatedProject = {...currentProject, total_progress: res.project.total_progress}
      setCurrentProject(updatedProject)
      sessionStorage.setItem("currentProject", JSON.stringify(updatedProject))
      setUpdateListActivities(!updateListActivites)
      setUpdateSubActivities(!updateSubActivities)
    }).catch(err => {
      console.log(err)
    })
  }

  const handleUpdateActivity = (e) => {
    console.log("UPDAte")
    e.preventDefault();
    updateActivity(activity._id, {
      relativeWeight: activityData.relativeWeight,
      relativeProgress: activityData.relativeProgress
    }).then(res => {
      const updatedProject = {...currentProject, total_progress: res.project.total_progress}
      setCurrentProject(updatedProject)
      sessionStorage.setItem("currentProject", JSON.stringify(updatedProject))
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

  useEffect(() => {
    setActivityData({
      absoluteWeight: activity.absolute_weight,
      relativeWeight: activity.relative_weight,
      relativeProgress: activity.relative_progress,
      absoluteProgress: activity.absolute_progress,
      relativeWeightPercentage: activity.relative_weight_percentage
    })
  }, [activity])
  
  const color = Object.values(colors.randomColors)[activity.index]
  return(
      <Wrapper color={color}>
        <form onSubmit={(e)=>handleUpdateActivity(e)}>
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
                <input type={"text"} value={activityData.relativeWeight} onChange={(e) => {
                  setActivityData({...activityData,relativeWeight: e.target.value})
                }}/>
                <p>| {(activityData.relativeWeightPercentage*100).toFixed(2)}%</p>
              </div>
            </DataContainer>
            <DataContainer>
              <p>Peso Absoluto: </p>
              <p>{(activity.absolute_weight*100).toFixed(2)}%</p>
            </DataContainer>
          </RelativeAbsoluteContainer>
          <RelativeAbsoluteContainer>
            <DataContainer color={Object.values(colors.randomColors)[activity.index]}>
              { 
                !(activity.has_subactivities) &&
                <>
                  <p>Progreso Relativo: </p>
                  <div style={{display:"flex"}}>
                    <input type={"number"} value={(activityData.relativeProgress*100).toFixed(2)} onChange={(e) => {
                      setActivityData({...activityData,relativeProgress: (+e.target.value)/100})
                    }}/>
                    <p>%</p>
                  </div>
                </>
              }
            </DataContainer>
            <DataContainer>
              <p>Progreso Absoluto: </p>
              <p>{(activityData.absoluteProgress*100).toFixed(2)}%</p>
            </DataContainer>
          </RelativeAbsoluteContainer>
          {
            editProjectPermission !== "view" &&
            <BiTrashAlt onClick={handleDeleteActivity} style={{color:colors.red.dark, scale: "1.1"}}/>
          }
          <input type="submit" hidden/>
        </form>
        <div>
          {
            subActivities &&
            <SubActivitiesContainer>
              {
                subActivities.map(subactivity =>{
                  return(
                    <ActivityCard key={subactivity._id} activity={subactivity} editProjectPermission={editProjectPermission}/>
                  )
                })
              }
              {
                editProjectPermission !== "view" &&
                <EmptyActivity parent={activity._id}/>
              }
            </SubActivitiesContainer>
          }
        </div>
      </Wrapper>
  )
}