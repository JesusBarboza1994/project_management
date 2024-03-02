'use strict'

const Activity = require("../activities/model");
const Project = require("../projects/model");
const MixedProject = require("./model");

async function create_mixed_project(req, res){
  try {
    const {ids, title} = req.body
    const actual_projects = await Project.find({ _id: { $in: ids } });
    if(actual_projects.length !== ids.length) return res.status(404).json({ error: "Uno o más de los proyectos no es válido." });
    
    const projects_array = ids.map(id => ({ project: id }));

    const new_mixed_project = await MixedProject.create({
      title,
      projects: projects_array,
      collaborators: [{
        user: req.user,
        permission: 'owner'
      }],
    });

    res.status(201).json(new_mixed_project)

  } catch (error) {
    console.log("🚀 ~ create_mixed_project ~ error:", error)
    return res.status(500).json({ error: 'Error al crear el proyecto combinado', message: error.message });
  }
}

async function show_mixed_project(req, res){
  try {
    const { id } = req.params
    console.log("🚀 ~ show_mixed_project ~ id:", id)
    const mixed_project = await MixedProject.findById(id)
    if(!mixed_project) return res.status(404).json({ error: 'No se encontro el proyecto combinado' });
    console.log("🚀 ~ show_mixed_project ~ mixed_project:", mixed_project)
    
    const mixed_activities = []
    for await (const project of mixed_project.projects) {
      const project_data = await Project.findById(project.project)
      const activities = await list_all_activities_of_project({id: project.project, title: project_data.title})
      mixed_activities.push(...activities)
    }

    res.status(200).json(mixed_activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el proyecto combinado.' });
  }
}

async function list_all_activities_of_project({id, title}){
  let complete_activities = []

  async function obtener_actividades_recursivas({parentId}){
    const found_activities = await Activity.find({ parent: parentId }).lean();
    found_activities.forEach(activity => activity.project = title)
    complete_activities = [...complete_activities, ...found_activities]
    for await (const activity of found_activities) {
      await obtener_actividades_recursivas({parentId: activity._id})
    }
  }

  await obtener_actividades_recursivas({parentId: id})
  return complete_activities
}

module.exports = {
  create_mixed_project,
  show_mixed_project
}