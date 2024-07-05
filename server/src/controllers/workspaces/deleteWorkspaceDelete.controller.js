import { deleteWorkspace } from "../../services/workspace/deleteWorkspace.service.js";

export default async function deleteWorkspaceDeleteController(req, res){
  // TODO: Al eliminar un workspace se tienen que borrar los proyectos dentro con sus actividades
  try {
    const id = req.params.id
    await deleteWorkspace({id})
    res.status(200).json({ message: 'Espacio de trabajo eliminado' });
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al crear el espacio de trabajo' }); // Agregamos una respuesta de error  
  } 
}
