const { deleteProjectsAndActivities } = require("../../utils.js/delete_associated");
const Project = require("../projects/model");
const Workspace = require("./model");
async function create_workspace(req, res){
  try {
    const {name} = req.body;
    const new_workspace = new Workspace({name, user: req.user});
    await new_workspace.save();
    res.status(201).json(new_workspace)
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al crear el proyecto' }); // Agregamos una respuesta de error
  }
}

async function list_workspaces(req, res){
  try {
    const workspaces = await Workspace.find({user: req.user});
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
      console.log("WORKSPACE", workspace)
      workspace.projects.forEach(project => {
        if(project.favorite){
          favorite_projects.push(project)
        }
      })
    });
    console.log("FAVORITE PROJECTS", favorite_projects)

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
    console.log("FAVORITE PROJECTS2", favorite_projects)



    res.status(200).json({workspaces:workspaceList, favoriteProjects:favorite_projects, sharedProjects:real_shared_projects, trashedProjects:trash_projects});
  } catch (error) {
    console.log("ERROR",error);
    res.status(500).json({ error: 'Error al obtener la lista de proyectos' });
  }
}
async function show_workspace(req, res){
  try {
    const workspace = await WorkSpace.findById(req.params.id);
    res.status(200).json(workspace);
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al obtener el proyecto' });
  }
}

async function delete_workspace(req, res){
  // TODO: Al eliminar un workspace se tienen que borrar los proyectos dentro con sus actividades
  try {
    const id = req.params.id
    await deleteProjectsAndActivities(id)
    await Workspace.findByIdAndDelete(id)
    res.status(200).json({ message: 'Espacio de trabajo eliminado' });
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al crear el espacio de trabajo' }); // Agregamos una respuesta de error  
  } 
}

async function update_workspace(req, res){
  try {
    const id = req.params.id;
    const {name} = req.body;
    const updated_workspace = await WorkSpace.findByIdAndUpdate(id, {name}, { new: true } );
    res.status(200).json(updated_workspace);
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al actualizar el espacio de trabajo' }); // Agregamos una respuesta de error  
  }
}

module.exports = {
  create_workspace,
  list_workspaces,
  show_workspace,
  delete_workspace,
  update_workspace
}