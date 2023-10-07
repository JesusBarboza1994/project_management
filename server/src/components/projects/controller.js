'use strict'

const Workspace = require("../workspaces/model.js");
const Project = require("./model.js");

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
    const new_project = new Project({title, workspace: workspace_id, user: req.user});
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
    await Project.findByIdAndDelete(id);
    res.status(200).json({ message: 'Proyecto eliminado' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al crear el proyecto' }); // Agregamos una respuesta de error  
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
      updated_project.favorite = !updated_project.favorite; 
      await updated_project.save(); 
      res.status(200).json(updated_project);
    } else {
      res.status(404).json({ error: "Proyecto no encontrado" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al actualizar el proyecto' }); // Agregamos una respuesta de error  
  }
}

module.exports = {
  list_projects,
  create_project,
  show_project,
  delete_project,
  update_project,
  set_favorite
}