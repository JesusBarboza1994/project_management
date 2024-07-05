import { FaFileExcel } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa6";
import { useState } from "react";
import { colors } from "../../styles";
import { Select, FilterDiv, Wrapper, FilterWrap, ExcelButton } from "./styles";
import { useAuth } from "../../context/auth-context";
import Button from "../../components/atoms/Button";
import Input from "../Input/Input";
import Loader from "../Loader/Loader"
import { generateExcelProject } from "../../services/project-service";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
export default function Filters({ maxOrder, id, type }){
  const {filters, setFilters, setTableActivities} = useAuth()
  const [ showFilter, setShowFilter ] = useState(false)
  const [showLoader, setShowLoader] = useState(null)
  const nav = useNavigate()
  const handleGenerateExcelProject = async() => {
    setShowLoader(true)
    await generateExcelProject({...filters, id, type})
    setShowLoader(false)
  };


  const handleSubmitFilters = (e) => {
    e.preventDefault()
    let activities = JSON.parse(sessionStorage.getItem("tableActivities"))
    if(filters.search && filters.search !== "" ){
      activities = activities.filter(activity => activity.title.toLowerCase().includes(filters.search.toLowerCase().trim()))
    }
    if(filters.progress !== 0){
      activities = activities.filter(activity => activity.relative_progress >= filters.progress)
    }
    if(filters.order){
      activities = activities.filter(activity => activity.order.length <= filters.order)
    }
    if(filters.date){
      activities = activities.filter(activity => new Date(activity.end_date) >= new Date(filters.date) && new Date(activity.init_date) <= new Date(filters.date))
    }
    setTableActivities(activities)
  }
  return(
    <Wrapper>
      <BiArrowBack style={{scale:"1.5", cursor:"pointer"}} onClick={() =>{
        type==="project" ? nav(`/projects/${id}`) : nav(`/workspaces`)
      }}/>
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
          <FilterDiv>
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
          <FilterDiv>
            <label htmlFor="date">Date</label>
            <div style={{display: "flex", alignItems: "center", gap: "6px"}}>
            <Input style={{marginBottom: "6px"}} type="date" name="date" value={filters.date} onChange={e => setFilters({...filters, date: e.target.value})}/>
            </div>
          </FilterDiv>
        </FilterWrap>
        <div style={{width:"400px", display: "flex", justifyContent: "space-between", marginTop: "12px"}}>
          <Button type={"solid"} text={"Aplicar"} onClick={(e)=>handleSubmitFilters(e)}/>
          <Button type={"outline"} text={"Limpiar"} onClick={() =>{
            console.log("FILRT", filters)
            setFilters({search: "", progress: 0, order: 0, date: ""})
            setTableActivities(JSON.parse(sessionStorage.getItem("tableActivities")))
          }}/>
          <ExcelButton onClick={handleGenerateExcelProject}>
            <FaFileExcel style={{color:"green"}}/>
            <p>Exportar</p>
          </ExcelButton>
          {showLoader && <Loader/>}
        </div>
      </>
     }
    </Wrapper>
  )
}
