const Project = require("../components/projects/model")

async function edit_permission (req, res, next){
  try {
    const project_id = req.query.project
    console.log("PROJECT_ID", project_id) 
    if(!project_id) return res.status(400).send({message: "La URL de acceso no está completa"})
    const project = await Project.findById(project_id)
    console.log("PROJECT", project)
    if(!project) return res.status(404).send({message: "La URL de acceso no corresponde a un proyecto"})
    const collaborator = project.collaborators.find(collaborator => collaborator.user.toString() === req.user)
    if(!collaborator) return res.status(404).send({message: "No tienes acceso a este proyecto"})
    if(["admin", "edit", "owner"].includes(collaborator.permission)) {
      next()
    }else{
      return res.status(401).send({message: "No tienes los permisos suficientes para esta acción."})
    }
  }catch (error) {
    console.log(error)
    return res.status(500).send({error: "Error al acceder al proyecto"})
  }
}
async function admin_permission (req, res, next){
  try {
    const project_id = req.params.id
    const user_id = req.user
    const project = await Project.findById(project_id)
    if(project){
      const collaborator = project.collaborators.find(collaborator => collaborator.user.toString() === user_id)
      if(collaborator){
        if(collaborator.permission === "admin" || collaborator.permission === "owner"){
          next()
        }else{
          return res.status(401).send({message: "No tienes los permisos suficientes para esta acción."})
        }
      }else{
        return res.status(401).send({message: "No tienes acceso a este proyecto"})
      }
    }else{
      return res.status(404).send({message: "Proyecto no encontrado"})
    }
   
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Error al acceder al proyecto"})
  }
}

module.exports={
  admin_permission,
  edit_permission
}