'use strict'

const Excel = require('exceljs')
const Activity = require("../../models/activity.model");
const Project = require("../../models/project.model");
const MixedProject = require("../../models/mixedProject.model");
const { listAllActivitiesByProject } = require("../activities/services.js/listAllActivitiesByProject");
const set_format_excel = require('../../utils.js/excel');
const User = require('../../models/user.model');

async function shared_mixed_project(req, res){
  try {
    const id = req.params.id;
    const { email, permission } = req.body;
    const user_shared = await User.findOne({ email });

    // Obtén el proyecto por su ID y agrega el nuevo colaborador a collaborators
    const updated_project = await MixedProject.findByIdAndUpdate(
      id,
      {
        $push: {
          collaborators: {
            user: user_shared,
            permission,
          },
        },
      },
      { new: true }
    );
    if (!updated_project) {
      return res.status(404).json({ error: "Proyecto combinado no encontrado" });
    }

    user_shared.collaborations.push({
      project: updated_project._id,
      permission,
    });
    user_shared.save();

    res.send(updated_project);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al compartir el proyecto" });
  }
}
async function create_mixed_project(req, res){
  try {
    const {ids, title, color} = req.body
    if(ids.length < 2) return res.status(400).json({ error: "Debe seleccionar al menos dos proyectos." });
    const actual_projects = await Project.find({ _id: { $in: ids } });
    if(actual_projects.length !== ids.length) return res.status(404).json({ error: "Uno o más de los proyectos no es válido." });
    
    const projects_array = ids.map(id => ({ project: id }));

    const new_mixed_project = await MixedProject.create({
      title,
      projects: projects_array,
      collaborators: [{
        color,
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

async function filter_mixed_project_activities(req, res){
  try {
    const { id } = req.params
    const { search="", order, date="", relative_progress=0} = req.body
    console.log("🚀 ~ generate_excel_mixed_project ~ req.body:", req.body)
    const mixed_project = await MixedProject.findById(id)
    if(!mixed_project) return res.status(404).json({ error: 'No se encontro el proyecto combinado' });
    let max_order_in_all_projects = 0
    const mixed_activities = []
    for await (const project of mixed_project.projects) {
      const { activities, max_order } = await listAllActivitiesByProject({project, order, search, date, relative_progress})
      if(max_order > max_order_in_all_projects){
        max_order_in_all_projects = max_order
      }
      mixed_activities.push(...activities)
    }
    return res.status(200).json({mixed_activities, max_order: max_order_in_all_projects});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener el proyecto combinado.' });
  }
}

async function generate_excel_mixed_project(req, res){
  const { id } = req.params
  const { search="", order, date="", relative_progress=0} = req.body
  console.log("🚀 ~ generate_excel_mixed_project ~ req.body:", req.body)
  const workbook = new Excel.Workbook()
  const mixed_project = await MixedProject.findById(id)
  if(!mixed_project) return res.status(404).json({ error: 'No se encontro el proyecto combinado' });
  const mixed_activities = []
  for await (const project of mixed_project.projects) {
    const { activities } = await listAllActivitiesByProject({project, order, search, date, relative_progress})
    mixed_activities.push(...activities)
  }
  set_format_excel({workbook, activities: mixed_activities})
  const filename = "Actividades.xlsx";
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

  workbook.xlsx.write(res)
    .then(() => {
      res.end();
      console.log('Archivo Excel enviado exitosamente.');
    })
    .catch((error) => {
      console.error('Error al enviar el archivo Excel:', error);
      res.status(500).send(error);
    });
}

module.exports = {
  create_mixed_project,
  filter_mixed_project_activities,
  generate_excel_mixed_project,
  shared_mixed_project
}