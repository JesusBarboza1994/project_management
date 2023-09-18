'use strict'

const Project = require("./model.js");

function list_projects(req, res){
  res.send("hello World")
}

async function create_project(req, res){
  console.log("HEY")
  console.log("BODY",req.body)
  try {
    const {title, ...data} = req.body;
    const new_project = new Project({title});
    await new_project.save();
    res.status(201).json(new_project)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al crear el proyecto' }); // Agregamos una respuesta de error
  }
}

module.exports = {
  list_projects,
  create_project
}