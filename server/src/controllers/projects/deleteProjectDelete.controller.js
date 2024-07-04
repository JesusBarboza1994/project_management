import { deleteProject } from "../../services/project/deleteProject.service.js";

export default async function deleteProjectDeleteController(req, res) {
  try {
    const id = req.params.id;
    const user = req.user

    const response = await deleteProject({ id, user })
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear el proyecto" }); // Agregamos una respuesta de error
  }
  
}