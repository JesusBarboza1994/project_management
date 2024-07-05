import { createMixedProject } from "../../services/mixedProject/createMixedProject.service.js";
import { CustomError } from "../../utils/customError.js";

export default async function createMixedProjectPostController(req, res){
  try {
    const {ids, title, color} = req.body
    const { user } = req
    if(ids.length < 2) throw new CustomError("El proyecto combinado debe tener al menos 2 proyectos", 400, "BAD_REQUEST")
    
    const newMixedProject = await createMixedProject({ids, title, color, user})
    res.status(201).json(newMixedProject)

  } catch (error) {
    console.log("🚀 ~ create_mixed_project ~ error:", error)
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })  
  }
}
