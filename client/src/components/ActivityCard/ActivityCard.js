import { BiSolidDownArrow, BiSolidRightArrow, BiTrashAlt } from "react-icons/bi";
import { DataContainer, ErrorMessage, SubActivitiesContainer, SubContainer, Wrapper } from "./styles";
import { useEffect, useRef, useState } from "react";
import { colors } from "../../styles";
import { deleteActivity, listActivities, updateActivity, updateNameActivity } from "../../services/activity-service";
import { useAuth } from "../../context/auth-context";
import EmptyActivity from "../EmptyActivity/EmptyActivity";
import { formatDateToString } from "../../utils";
import Loader from "../Loader/Loader";

export default function ActivityCard({setShowModalCurrentActivityDetails, activity, editProjectPermission, setShowModalDeleteActivity}) {
  const {setUpdateListActivities, setCurrentActivity,updateListActivites, updateSubActivities, setUpdateSubActivities, setCurrentProject, currentProject} = useAuth()
  const [subActivities, setSubActivities] = useState(null)
  const ejecutarEfectoRef = useRef(false);
  const [activityData, setActivityData] = useState({})
  const [loader, setLoader] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null);
  const [showActivityName, setShowActivityName] = useState(false)
  
  const handleSubActivities = () => {
    ejecutarEfectoRef.current = true;
    setUpdateSubActivities(!updateSubActivities)
  }
  const handleDeleteActivity = () => {
    setShowModalDeleteActivity(true)
    setCurrentActivity(activity)
    console.log("ACTIVITY", activity)
    // deleteActivity(activity._id).then(res => {
    //   const updatedProject = {...currentProject, total_progress: res.project.total_progress}
    //   setCurrentProject(updatedProject)
    //   sessionStorage.setItem("currentProject", JSON.stringify(updatedProject))
    //   setUpdateListActivities(!updateListActivites)
    //   setUpdateSubActivities(!updateSubActivities)
    // }).catch(err => {
    //   console.log(err)
    // })
  }
  const handleUpdateNameActivity = (e) => {
    e.preventDefault();
    setShowActivityName(false)
    updateNameActivity(activity._id,activityData.title).then(res => {
      setUpdateListActivities(!updateListActivites)
    }).catch(err => {
      console.log(err)
    })
    document.getElementById("activityname").blur()
  }
  const handleUpdateActivity = (e) => {
    e.preventDefault();
    setLoader(true)

    updateActivity(activity._id, {
      relativeWeight: activityData.relativeWeight,
      relativeProgress: activityData.relativeProgress/100,
      initDate: activityData.initDate,
      endDate: activityData.endDate
    }).then(res => {
      if(res.errors){
        setLoader(false)
        setError(res.errors)
        return
      } 
      const updatedProject = {...currentProject, total_progress: res.project.total_progress, init_date: res.project.init_date, end_date: res.project.end_date}
      setCurrentProject(updatedProject)
      setLoader(false)
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
    setError(null)
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowActivityName(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowActivityName(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef]);
  
  const color = Object.values(colors.randomColors)[activity.index]
  return(
      <Wrapper color={color} onClick={() => {
        // setShowModalCurrentActivityDetails(true)
        // setCurrentActivity(activity)
      }}>
        <SubContainer>
          <div>
            <div style={{display: "flex", alignItems: "center"}}>
              {subActivities 
                ? 
                  <BiSolidDownArrow onClick={()=> setSubActivities(null)}/>
                : 
                  <BiSolidRightArrow onClick={handleSubActivities}/>
              }
              <form className="activity-name" onSubmit={(e) => handleUpdateNameActivity(e)}>
              {showActivityName ?
                <input
                  id="activityname"
                  value={activityData.title}
                  ref={inputRef}
                  onChange={(e) => setActivityData({ ...activityData, title: e.target.value })}
                  onBlur={() => setShowActivityName(false)} // Aquí se maneja el evento onBlur
                  autoFocus
                />
                :
                <p id="activityname" onClick={() => setShowActivityName(true)}>{activity.order.join(".")}. {activity.title}</p>
              }
            </form>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "6px"}}>
              {loader && <Loader/>}
              {
                editProjectPermission !== "view" &&
                <BiTrashAlt className="hidden-desktop" onClick={handleDeleteActivity} style={{color:colors.primary.dark, scale: "1.1"}}/>
              }
            </div>
          </div>
          {error &&<div>
            <ErrorMessage style={{color: "red"}}>{error}</ErrorMessage>
          </div>}
          <form className="progress-weight" onSubmit={(e)=>handleUpdateActivity(e)}>
            <div style={{display: "flex", gap:"12px"}}>
              <DataContainer color={Object.values(colors.randomColors)[activity.index]}>
                <p>Peso: </p>
                <div>
                  <input style={{width: "22px", fontSize:"12px"}} type={"text"} value={activityData.relativeWeight} onChange={(e) => {
                    setActivityData({...activityData,relativeWeight: e.target.value})
                    if(error) setError(null)
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
                      <input style={{width: "32px", fontSize:"12px"}} type={"text"} value={activityData.relativeProgress} onChange={(e) => {
                        setActivityData({...activityData,relativeProgress:e.target.value})
                        if(error) setError(null)
                      }}
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
                  if(error) setError(null)
                }}/>
                <input type={"date"} value={formatDateToString(activityData.endDate)} onChange={(e) => {
                  setActivityData({...activityData,endDate: e.target.value})
                  if(error) setError(null)
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
                    <ActivityCard setShowModalCurrentActivityDetails={setShowModalCurrentActivityDetails} setShowModalDeleteActivity={setShowModalDeleteActivity} key={subactivity._id} activity={subactivity} editProjectPermission={editProjectPermission}/>
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
