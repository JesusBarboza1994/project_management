const set_format_excel = require('../../../utils.js/excel')
const { listAllActivitiesByProject } = require('../../activities/services.js/listAllActivitiesByProject')
async function generateExcel({id, search, order, date, relative_progress, workbook}){
  const project = {project: id}
  const filter_activities = await listAllActivitiesByProject({project, search, order, date, relative_progress})
  set_format_excel({workbook, activities: filter_activities.activities})
  
}



module.exports = generateExcel