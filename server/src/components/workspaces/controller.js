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
    const workspaceList = await Promise.all(workspaces.map(async (workspace) => {
      projects = await Project.find({ workspace: workspace._id });

      return {
        name: workspace.name,
        id: workspace.id,
        projects: projects.map((project) => ({
          id: project.id,
          title: project.title,
          total_progress: project.total_progress,
          color: project.color,
          favorite: project.favorite
          // Agrega otros campos del proyecto según sea necesario
        }))
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
    console.log("FAVORITE PROJECTS", favorite_projects)
    res.status(200).json({workspaces:workspaceList, favoriteProjects:favorite_projects});
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