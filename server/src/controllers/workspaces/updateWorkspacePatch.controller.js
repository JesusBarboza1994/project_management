import { updateWorkspace } from "../../services/workspace/updateWorkspace.service.js";

export default async function updateWorkspacePatchController(req, res) {
  try {
    const id = req.params.id;
    const {name} = req.body;
    const updatedWorkspace = await updateWorkspace({id, name});
    res.status(200).json(updatedWorkspace);
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al actualizar el espacio de trabajo' }); // Agregamos una respuesta de error  
  }
}