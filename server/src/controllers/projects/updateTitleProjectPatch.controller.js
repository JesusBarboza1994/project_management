import { updateTitleProject } from "../../services/project/updateTitleProject.service.js";

export default async function updateTitleProjectPatchController(req, res){
  try {
    const id = req.params.id;
    const { title } = req.body;
    const updatedPoject = await updateTitleProject({id, title});
    res.status(200).json(updatedPoject);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error al actualizar el título del proyecto" }); // Agregamos una respuesta de error
  }
}