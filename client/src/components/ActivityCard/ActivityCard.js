import { BiSolidDownArrow, BiSolidRightArrow, BiTrashAlt } from "react-icons/bi";
import { DataContainer, RelativeAbsoluteContainer, SubActivitiesContainer, SubContainer, TitleContainer, Wrapper } from "./styles";
import { useEffect, useRef, useState } from "react";
import { colors } from "../../styles";
import { deleteActivity, listActivities, updateActivity, updateNameActivity } from "../../services/activity-service";
import { useAuth } from "../../context/auth-context";
import EmptyActivity from "../EmptyActivity/EmptyActivity";
import { formatDateToString } from "../../utils";

export default function ActivityCard({activity, editProjectPermission}){
  const [subActivities, setSubActivities] = useState(null)
  const {setUpdateListActivities, updateListActivites, updateSubActivities, setUpdateSubActivities, setCurrentProject, currentProject} = useAuth()
  const ejecutarEfectoRef = useRef(false);
  const [activityData, setActivityData] = useState({})
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
  const handleUpdateNameActivity = (e) => {
    e.preventDefault();
    updateNameActivity(activity._id,activityData.title).then(res => {
      
    }).catch(err => {
      console.log(err)
    })
    document.getElementById("activityname").blur()
  }
  const handleUpdateActivity = (e) => {
    e.preventDefault();
    updateActivity(activity._id, {
      relativeWeight: activityData.relativeWeight,
      relativeProgress: activityData.relativeProgress/100,
      initDate: activityData.initDate,
      endDate: activityData.endDate
    }).then(res => {
      const updatedProject = {...currentProject, total_progress: res.project.total_progress, init_date: res.project.init_date, end_date: res.project.end_date}
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
      title: activity.title,
      absoluteWeight: activity.absolute_weight,
      relativeWeight: activity.relative_weight,
      relativeProgress: activity.relative_progress*100,
      absoluteProgress: activity.absolute_progress,
      relativeWeightPercentage: activity.relative_weight_percentage,
      initDate: activity.init_date,
      endDate: activity.end_date
    })
  }, [activity])
  
  const color = Object.values(colors.randomColors)[activity.index]
  return(
      <Wrapper color={color}>
        <SubContainer>
          <div>
            <div style={{display: "flex", alignItems: "center"}}>
              {subActivities 
                ? 
                // <TitleContainer >
                  <BiSolidDownArrow onClick={()=> setSubActivities(null)}/>
                  // <p>{activity.description}</p>
                // </TitleContainer>
                : 
                // <TitleContainer >
                  <BiSolidRightArrow onClick={handleSubActivities}/>
                  // </TitleContainer>
                }
              <form className="acitivity-name" onSubmit={(e)=>handleUpdateNameActivity(e)}>
                <input id="activityname" value={activityData.title} onChange={(e) => setActivityData({...activityData, title: e.target.value})}/>
              </form>
            </div>
            {
              editProjectPermission !== "view" &&
              <BiTrashAlt className="hidden-desktop" onClick={handleDeleteActivity} style={{color:colors.primary.dark, scale: "1.1"}}/>
            }
          </div>
          <form className="progress-weight" onSubmit={(e)=>handleUpdateActivity(e)}>
            <div  style={{display: "flex"}}>
              <DataContainer color={Object.values(colors.randomColors)[activity.index]}>
                <p>Peso: </p>
                <div>
                  <input type={"text"} value={activityData.relativeWeight} onChange={(e) => {
                    setActivityData({...activityData,relativeWeight: e.target.value})
                  }}/>
                  <p>| {(activityData.relativeWeightPercentage*100).toFixed(2)}%</p>
                </div>
              </DataContainer>
              <DataContainer color={Object.values(colors.randomColors)[activity.index]}>
                { 
                  !(activity.has_subactivities) &&
                  <>
                    <p>Progreso: </p>
                    <div>
                      <input type={"text"} value={activityData.relativeProgress} onChange={(e) => {
                        setActivityData({...activityData,relativeProgress:e.target.value})}} 
                        />
                      <p>%</p>
                    </div>
                  </>
                }
              </DataContainer>
            </div>
            <DataContainer color={Object.values(colors.randomColors)[activity.index]}>
              <p>Inicio-Fin: </p>
              <div>
                <input type={"date"} value={formatDateToString(activityData.initDate)} onChange={(e) => {
                  setActivityData({...activityData,initDate: e.target.value})
                }}/>
                <input type={"date"} value={formatDateToString(activityData.endDate)} onChange={(e) => {
                  setActivityData({...activityData,endDate: e.target.value})
                }}/>
              </div>
            </DataContainer>
            <input type="submit" hidden/>
          </form>
            {
              editProjectPermission !== "view" &&
              <BiTrashAlt className="hidden-mobile" onClick={handleDeleteActivity} style={{color:colors.primary.dark, scale: "1.1"}}/>
            }
        </SubContainer>
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
