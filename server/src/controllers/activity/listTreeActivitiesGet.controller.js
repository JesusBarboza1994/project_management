import { listActivitiesRecursively } from "../../services/activity/recursive/listActivitiesRecursively.service.js";

export default async function listTreeActivitiesGetController(req, res){
  try {
    const id = req.params.id
    const activities = await listActivitiesRecursively(id)
    if(activities.length === 0) return res.status(200).json([]);
    res.status(200).json(activities);
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al obtener la lista de proyectos' });
  }
}