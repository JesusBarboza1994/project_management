import { listCollaborationProjects } from "../../services/project/listCollaborationProjects.service.js";

export default async function listCollaborationProjectsGetController(req, res) {
  try {
    const { user } = req;
    const response = await listCollaborationProjects({user});

    res.status(200).json(response);
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ error: "Error al obtener todos los proyectos" })
  }
}