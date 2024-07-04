import { createWorkspace } from "../../services/workspace/createWorkspace.service.js";

export default async function createWorkspacePostController(req, res) {
  try {
    const {name} = req.body;
    const newWorkspace = await createWorkspace({name, user: req.user._id})
    res.status(201).json(newWorkspace)
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al crear el proyecto' }); // Agregamos una respuesta de error
  }
} 