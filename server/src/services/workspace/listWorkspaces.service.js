import Project from "../../models/project.model.js";
import Workspace from "../../models/workspace.model.js";
import { CustomError } from "../../utils/customError.js";

export async function listWorkspaces({user}){
  const workspaces = await Workspace.find({user});
  if(workspaces.length === 0) throw new CustomError("No se encontraron espacios de trabajo", 404, 'NOT_FOUND')
  const trash_projects = []
  const workspaceList = await Promise.all(workspaces.map(async (workspace) => {
  const projects = await Project.find({ workspace: workspace._id });
    return {
      name: workspace.name,
      id: workspace.id,
      projects: projects.map((project) => {
        if(project.is_deleted) {
          trash_projects.push({
          _id: project.id,
          title: project.title,
          total_progress: project.total_progress,
          color: project.color,
          init_date: project.init_date,
          end_date: project.end_date,
          favorite: project.collaborators.find(collaborator => collaborator.user.toString() === req.user).favorite,
          })
          return null
        }else{
          return {
            _id: project.id,
            title: project.title,
            total_progress: project.total_progress,
            color: project.color,
            init_date: project.init_date,
            end_date: project.end_date,
            favorite: project.collaborators.find(collaborator => collaborator.user.toString() === req.user).favorite,
            // Agrega otros campos del proyecto según sea necesario
          }
        }
    }).filter(project => project !== null)
    };
  }));
  
  const favorite_projects = []
  workspaceList.forEach(workspace => {
    workspace.projects.forEach(project => {
      if(project.favorite){
        favorite_projects.push(project)
      }
    })
  });

  const shared_projects = await Project.find({
    "collaborators.user": req.user
  });
  const real_shared_projects = shared_projects.filter(project => {
    const value = project.collaborators.some(collaborator => {
      if(collaborator.user.toString() === req.user && collaborator.permission !== "owner" && collaborator.favorite){
        favorite_projects.push(project)
      }
      return (collaborator.user.toString() === req.user && collaborator.permission !== "owner")
    })
    return value
  })

  return {workspaces:workspaceList, favoriteProjects:favorite_projects, sharedProjects:real_shared_projects, trashedProjects:trash_projects}
}