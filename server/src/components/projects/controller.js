'use strict'

const { deleteDescendantActivities } = require("../../utils.js/delete_associated.js");
const Workspace = require("../workspaces/model.js");
const Project = require("./model.js");
const User = require("../users/model.js")

async function list_projects(req, res){
  try {
    // Consulta todos los proyectos
    const projects = await Project.find({ workspace: req.params.id_workspace });
    if(projects.length === 0){
      return res.status(404).json({ error: 'No hay proyectos en este workspace' });
    }
    // Responde con la lista de projects en formato JSON
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de proyectos' });
  }
}

// TODO: Validar que el dueño del project tenga acceso a este
async function show_project(req, res){
  try {
    const project = await Project.findById(req.params.id);
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el proyecto' });
  }
}

// TODO: Validar que el usuario que crea el proyecto dentro del workspace, sea dueño del workspace
async function create_project(req, res){
  try {
    const {title} = req.body;
    const workspace_id = req.params.id_workspace;
    // get workspace with id
    const workspace = await Workspace.findById(req.params.id_workspace);
    console.log("workspace user", workspace.user.toHexString())
    console.log("req user", req.user)
    if(!workspace || !(workspace.user.toHexString() == req.user)) res.status(400).json({ error: 'Este workspace no pertenece a este usuario' });
    const new_project = new Project({title, workspace: workspace_id, user: req.user, collaborators: [{
      user: req.user,
      permission: 'owner'
    }]});
    await new_project.save();
    res.status(201).json(new_project)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al crear el proyecto' }); 
  }
}

async function delete_project(req, res){
  try {
    const id = req.params.id
    const project = await Project.findById(id);
    if(!project.is_deleted){
      await Project.findByIdAndUpdate(id, { is_deleted: true });
      return res.status(200).json({ message: 'Proyecto en papelera' });
    } 
    deleteDescendantActivities(id)
    await Project.findByIdAndDelete(id);
    res.status(200).json({ message: 'Proyecto eliminado' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al crear el proyecto' }); // Agregamos una respuesta de error  
  } 
}

async function restore_from_trash_project(req, res){
  try {
    const id = req.params.id
    await Project.findByIdAndUpdate(id, { is_deleted: false });
    res.status(200).json({ message: 'Proyecto enviado/regresado a la papelera' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al enviar a la papelera el proyecto' }); // Agregamos una respuesta de error
  }  
}

async function update_project(req, res){
  try {
    const id = req.params.id;
    const body = req.body;
    const updated_project = await Project.findByIdAndUpdate(id, body, { new: true } );
    res.status(200).json(updated_project);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al actualizar el proyecto' }); // Agregamos una respuesta de error  
  }
}

async function set_favorite(req, res){
  try {
    const id = req.params.id;
    const updated_project = await Project.findById(id);
    if (updated_project) {
      console.log("REQ USER", updated_project.collaborators);
      const collaborator = updated_project.collaborators.find(collaborator => collaborator.user.toString() === req.user);
      updated_project.collaborators = [...updated_project.collaborators.filter(collaborator => collaborator.user.toString() !== req.user), {
        user: req.user,
        favorite: !collaborator.favorite,
        permission: collaborator.permission
      }] 
      await updated_project.save(); 
      res.status(200).json({
          _id: updated_project.id,
          title: updated_project.title,
          total_progress: updated_project.total_progress,
          color: updated_project.color,
          favorite: updated_project.collaborators.find(collaborator => collaborator.user.toString() === req.user).favorite,
          // Agrega otros campos del proyecto según sea necesario
        });
    } else {
      res.status(404).json({ error: "Proyecto no encontrado" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al actualizar el proyecto' }); // Agregamos una respuesta de error  
  }
}

async function update_color_project(req, res){
  try {
    const id = req.params.id;
    const {color} = req.body;
    const updated_project = await Project.findById(id);
    if (updated_project) {
      updated_project.color = color; 
      await updated_project.save(); 
      res.status(200).json(updated_project);
    } else {
      res.status(404).json({ error: "Proyecto no encontrado" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al actualizar el color del proyecto' }); // Agregamos una respuesta de error  
  }
}

// async function shared_project(req, res){
//   try {
//     const id = req.params.id;
//     const {email, permission} = req.body
//     const project = Project.findById(id);
//     if(!project){
//       return res.status(404).json({ error: 'Proyecto no encontrado' });
//     }
//     const user_shared = await User.find({email});
  
//     if(!user_shared){
//       return res.status(404).json({ error: 'Usuario no existe' });
//     }
//     // Inicializa collaborators como un array vacío si es nulo o undefined
//     project.collaborators = project.collaborators || [];
    
//     // Agrega el nuevo colaborador al array de collaborators
//     project.collaborators.push({
//       user: user_shared[0]._id.toString(),
//       permission
//     });
    
//     // Guarda los cambios en el proyecto
//     const updated_project = await project.save();
//     console.log("updated_project", updated_project)
//     res.send(updated_project)
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Error al compartir el proyecto' });
//   }
// }
async function shared_project(req, res) {
  try {
    const id = req.params.id;
    const { email, permission } = req.body;
    const user_shared = await User.find({email});
    // Obtén el proyecto por su ID y agrega el nuevo colaborador a collaborators
    const updated_project = await Project.findByIdAndUpdate(
      id,
      {
        $push: {
          collaborators: {
            user: user_shared[0],
            permission,
          },
        },
      },
      { new: true }
    );

    if (!updated_project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.send(updated_project);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al compartir el proyecto' });
  }
}
module.exports = {
  list_projects,
  create_project,
  show_project,
  delete_project,
  update_project,
  set_favorite,
  update_color_project,
  shared_project,
  restore_from_trash_project
}