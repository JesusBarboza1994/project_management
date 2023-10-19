const Activity = require("../components/activities/model");
const Project = require("../components/projects/model");

async function deleteDescendantActivities(parentId) {
  let descendants = null;
  descendants = await Activity.find({ parent: parentId });
  if (!descendants || descendants.length === 0) {
    descendants = [];
  }

  
  const deletionPromises = [];

  if (descendants.length > 0) {
    for (const descendant of descendants) {
      // Elimina las subactividades de este descendiente
      deletionPromises.push(deleteDescendantActivities(descendant._id));
  
      // Luego, elimina el descendiente actual
      deletionPromises.push(Activity.findByIdAndDelete(descendant._id));
    }
  }

  // Espera a que todas las eliminaciones se completen antes de continuar
  await Promise.all(deletionPromises);

  console.log("eliminado");
}

async function deleteProjectsAndActivities(workspaceId) {
  // Busca y elimina los proyectos relacionados con el workspace
  const projects = await Project.find({ workspace: workspaceId });
  for (const project of projects) {
    // Llama a la función recursivamente para eliminar actividades asociadas
    await deleteDescendantActivities(project._id);

    // Elimina el proyecto actual
    await Project.findByIdAndDelete(project._id);
  }
}

module.exports = {
  deleteDescendantActivities,
  deleteProjectsAndActivities
}

