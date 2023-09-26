'use strict'

const Project = require("./model.js");

async function list_projects(req, res){
  try {
    // Consulta todos los proyectos
    const proyectos = await Project.find();

    // Responde con la lista de proyectos en formato JSON
    res.status(200).json(proyectos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de proyectos' });
  }
}

async function show_project(req, res){
  try {
    const proyecto = await Project.findById(req.params.id);
    res.status(200).json(proyecto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el proyecto' });
  }
}

async function create_project(req, res){
  try {
    const {title, workspace} = req.body;
    const new_project = new Project({title, workspace});
    await new_project.save();
    res.status(201).json(new_project)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al crear el proyecto' }); // Agregamos una respuesta de error
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

module.exports = {
  list_projects,
  create_project,
  show_project,
  delete_project,
  update_project
}