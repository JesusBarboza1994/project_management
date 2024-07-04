import Project from "../../models/project.model.js";

export async function updateProject({ id, body }) {
  const updateProject = await Project.findByIdAndUpdate(id, body, {
    new: true,
  });
  return updateProject
}