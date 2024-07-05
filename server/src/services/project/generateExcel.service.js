import Excel from 'exceljs'
import { setFormatExcel } from '../../utils/excel.js'
import { listAllActivitiesByProject } from '../activity/listAllActivitiesByProject.js'

export async function generateExcel({id, search, order, date, relative_progress}){
  const workbook = new Excel.Workbook()
  const filename = "Actividades.xlsx";
  const filter_activities = await listAllActivitiesByProject({id, search, order, date, relative_progress})
  setFormatExcel({workbook, activities: filter_activities.activities})

  return {workbook, filename}
}
