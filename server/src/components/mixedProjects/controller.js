'use strict'

const Activity = require("../activities/model");
const Project = require("../projects/model");
const MixedProject = require("./model");

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

async function show_mixed_project(req, res){
  try {
    const { id } = req.params
    const mixed_project = await MixedProject.findById(id)
    if(!mixed_project) return res.status(404).json({ error: 'No se encontro el proyecto combinado' });
    
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
  return ordenar_objetos_por_order(complete_activities)
}


function ordenar_objetos_por_order(objetos) {
  // Función de comparación personalizada para ordenar los objetos
  function comparar_por_order(a, b) {
      // Itera sobre la longitud máxima de los arrays "order"
      for (let i = 0; i < Math.max(a.order.length, b.order.length); i++) {
          // Obtiene los dígitos de cada objeto, si no existen, asume 0
          const digitoA = a.order[i] || 0;
          const digitoB = b.order[i] || 0;

          // Compara los dígitos
          if (digitoA !== digitoB) {
              return digitoA - digitoB;
          }
      }

      // Si todos los dígitos son iguales, retorna 0 (no hay cambio en el orden)
      return 0;
  }

  // Ordena los objetos utilizando la función de comparación personalizada
  objetos.sort(comparar_por_order);

  return objetos;
}






module.exports = {
  create_mixed_project,
  show_mixed_project
}