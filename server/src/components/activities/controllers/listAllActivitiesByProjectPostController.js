const Project = require("../../projects/model");
const { listAllActivitiesByProject } = require("../services.js/listAllActivitiesByProject");

async function listAllActivitiesByProjectPostController(req, res) {
  try {
    const { id } = req.params
    const { search="", order, date="", relative_progress=0} = req.body
    const project = await Project.findById(id)
    if(!project) return res.status(404).json({ error: 'No se encontro el proyecto' });
    const { activities, max_order } = await listAllActivitiesByProject({project:{project: id}, order, search, date, relative_progress})
    return res.status(200).json({ activities, max_order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener las actividades del proyecto.' });
  }
}

module.exports = {listAllActivitiesByProjectPostController}