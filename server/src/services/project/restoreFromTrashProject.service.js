import Project from "../../models/project.model.js";

export async function restoreFromTrashProject({ id }) {
  const updateProject = await Project.findByIdAndUpdate(
    id,
    { is_deleted: false }
  )
  return updateProject
}