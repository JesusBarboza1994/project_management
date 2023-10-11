const Activity = require("../components/activities/model");
const Project = require("../components/projects/model");

async function deleteDescendantActivities(parentId) {
  const descendants = await Activity.find({ parent: parentId });
  for (const descendant of descendants) {
    // Elimina las subactividades de este descendiente
    await deleteDescendantActivities(descendant._id);

    // Luego, elimina el descendiente actual
    await Activity.findByIdAndDelete(descendant._id);
  }
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

