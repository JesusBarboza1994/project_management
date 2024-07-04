import { listAllActivitiesByProject } from '../../components/activities/services.js/listAllActivitiesByProject.js'
import { setFormatExcel } from '../../utils/excel.js'

export async function generateExcel({id, search, order, date, relative_progress, workbook}){
  const project = {project: id}
  const filter_activities = await listAllActivitiesByProject({project, search, order, date, relative_progress})
  setFormatExcel({workbook, activities: filter_activities.activities})
}
