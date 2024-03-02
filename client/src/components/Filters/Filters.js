import Input from "../Input/Input";
import { useAuth } from "../../context/auth-context";
import { colors } from "../../styles";
import { Select, FilterDiv, Wrapper, FilterWrap } from "./styles";
import { FaFilter } from "react-icons/fa6";
import { useState } from "react";
import Button from "../../components/Button";
export default function Filters({ maxOrder }){
  const {filters, setFilters, setTableActivities} = useAuth()
  const [ showFilter, setShowFilter ] = useState(false)

  const handleSubmitFilters = (e) => {
    e.preventDefault()
  
    let activities = JSON.parse(sessionStorage.getItem("mixedActivities"))
    console.log("🚀 ~ handleSubmitFilters ~ activities:", activities)
    if(filters.search && filters.search !== "" ){
      activities = activities.filter(activity => activity.title.toLowerCase().includes(filters.search.toLowerCase().trim()))
    }
    if(filters.progress !== 0){
      activities = activities.filter(activity => activity.relative_progress >= filters.progress)
    }
    if(filters.order){
      activities = activities.filter(activity => activity.order.length <= filters.order)
    }
    if(filters.end_date){
      activities = activities.filter(activity => activity.end_date >= filters.end_date)
    }
    if(filters.init_date){
      activities = activities.filter(activity => activity.init_date <= filters.init_date)
    }
    console.log("🚀 ~ handleSubmitFilters ~ activities:", activities)
    setTableActivities(activities)
  }
  return(
    <Wrapper>
      <div style={{display: "flex", alignItems: "center", gap: "6px", cursor: "pointer"}}
        onClick={() => setShowFilter(!showFilter)}
      >
        <FaFilter/>
        <p>Filters</p>
      </div>
     { showFilter && 
      <>
        <FilterWrap>
          <div style={{width: "200px", border: `1px solid ${colors.background.highlight}`, padding: "6px", borderRadius: "8px"}}>
            <Input placeholder={"Búsqueda por título"} value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} label="Search"/>
          </div>
          <FilterDiv style={{width: "200px", border: `1px solid ${colors.background.highlight}`, padding: "6px", borderRadius: "8px"}}>
            <label htmlFor="order">Order</label>
            <Select id="order" onChange={e => setFilters({...filters, order: e.target.value})} value={filters.order} name="order">
              <option disabled selected>Selecciona</option>
              {Array(maxOrder).fill().map((_, index) => <option key={index} value={index+1}>{index+1}</option>)}
            </Select>
          </FilterDiv>
          <FilterDiv>
            <label htmlFor="progress">Progress</label>
            <div style={{display: "flex", alignItems: "center", gap: "6px"}}>
              <input id="progress" type="range" name="nombre" min={0} max={1} value={filters.progress} onChange={e => setFilters({...filters, progress: e.target.value})} step={0.05}/>
              <span>{(filters.progress*100).toFixed(0)}%</span>
            </div>
          </FilterDiv>
          <FilterDiv style={{width:"300px"}}>
            <label htmlFor="date">Date</label>
            <div style={{display: "flex", alignItems: "center", gap: "6px"}}>
            <Input style={{marginBottom: "6px"}} type="date" name="date" value={filters.init_date} onChange={e => setFilters({...filters, init_date: e.target.value})}/>
            <span>-</span>
            <Input type="date" name="date" value={filters.end_date} onChange={e => setFilters({...filters, end_date: e.target.value})}/>

            </div>
          </FilterDiv>
        </FilterWrap>
        <div style={{width:"300px"}}>
          <Button type={"solid"} text={"Aplicar"} onClick={(e)=>handleSubmitFilters(e)}/>
        </div>
      </>
     }
    </Wrapper>
  )
}