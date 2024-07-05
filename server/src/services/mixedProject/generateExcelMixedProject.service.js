import Excel from 'exceljs'
import MixedProject from '../../models/mixedProject.model.js'
import { CustomError } from '../../utils/customError.js'
import { listAllActivitiesByProject } from '../activity/listAllActivitiesByProject.js'

export async function generateExcelMixedProject({ id, search, order, date, relative_progress }){
  const workbook = new Excel.Workbook()
  const mixedProject = await MixedProject.findById(id)
  if(!mixedProject) throw new CustomError("Proyecto combinado no encontrado", 404, "BAD_REQUEST")
  const mixed_activities = []
  for await (const project of mixedProject.projects) {
    const { activities } = await listAllActivitiesByProject({id, order, search, date, relative_progress})
    mixed_activities.push(...activities)
  }
  setFormatExcel({workbook, activities: mixed_activities})
  const filename = "Actividades.xlsx";
  return { workbook, filename }
}