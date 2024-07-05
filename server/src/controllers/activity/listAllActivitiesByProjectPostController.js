import { listAllActivitiesByProject } from "../../services/activity/listAllActivitiesByProject.js";

export default async function listAllActivitiesByProjectPostController(req, res) {
  try {
    const { id } = req.params
    const { search="", order, date="", relative_progress=0} = req.body
    const { activities, max_order } = await listAllActivitiesByProject({id, order, search, date, relative_progress})
    return res.status(200).json({ activities, max_order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener las actividades del proyecto.' });
  }
}
