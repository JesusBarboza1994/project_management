"use strict";

const {
  deleteDescendantActivities,
} = require("../../../utils.js/delete_associated.js");
const Workspace = require("../../../models/workspace.model.js");
const Project = require("../../../models/project.model.js");
const User = require("../../../models/user.model.js");
const { default: mongoose } = require("mongoose");
const MixedProject = require("../../../models/mixedProject.model.js");

async function list_projects(req, res) {
  try {
    // Consulta todos los proyectos
    const projects = await Project.find({ workspace: req.params.id_workspace });
    if (projects.length === 0) {
      return res
        .status(404)
        .json({ error: "No hay proyectos en este workspace" });
    }
    // Responde con la lista de projects en formato JSON
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la lista de proyectos" });
  }
}

// TODO: Validar que el dueño del project tenga acceso a este
async function show_project(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el proyecto" });
  }
}

// TODO: Validar que el usuario que crea el proyecto dentro del workspace, sea dueño del workspace
async function create_project(req, res) {
  try {
    const { title, color } = req.body;
    const workspace_id = req.params.id_workspace;
    const workspace = await Workspace.findById(req.params.id_workspace);
    if (!workspace || !(workspace.user.toHexString() == req.user))
      res
        .status(400)
        .json({ error: "Este workspace no pertenece a este usuario" });
    const new_project = new Project({
      title,
      color,
      workspace: workspace_id,
      user: req.user,
      collaborators: [
        {
          user: req.user,
          permission: "owner",
        },
      ],
    });
    await User.findOneAndUpdate(
      { _id: req.user },
      {
        $push: {
          collaborations: { project: new_project._id, permission: "owner" },
        },
      }
    );
    await new_project.save();
    res.status(201).json(new_project);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear el proyecto" });
  }
}

async function delete_project(req, res) {
  try {
    const id = req.params.id;
    const project = await Project.findById(id);
    if (!project.is_deleted) {
      const collaborator = project.collaborators.find(
        (collaborator) => collaborator.user.toString() === req.user
      );
      const collaborators = [
        ...project.collaborators.filter(
          (collaborator) => collaborator.user.toString() !== req.user
        ),
        {
          user: req.user,
          favorite: false,
          permission: collaborator.permission,
        },
      ];
      await Project.findByIdAndUpdate(id, {
        is_deleted: true,
        collaborators: collaborators,
      });
      return res.status(200).json({ message: "Proyecto en papelera" });
    }
    await User.findOneAndUpdate(
      { _id: req.user },
      { $pull: { collaborations: { project: project._id } } }
    );
    await MixedProject.updateMany(
      { "projects.project": project._id },
      { $pull: { projects: { project: project._id } } }
    );
    deleteDescendantActivities(id);
    await Project.findByIdAndDelete(id);
    res.status(200).json({ message: "Proyecto eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear el proyecto" }); // Agregamos una respuesta de error
  }
}

async function restore_from_trash_project(req, res) {
  try {
    const id = req.params.id;
    await Project.findByIdAndUpdate(id, { is_deleted: false });
    res
      .status(200)
      .json({ message: "Proyecto enviado/regresado a la papelera" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error al enviar a la papelera el proyecto" }); // Agregamos una respuesta de error
  }
}

async function update_project(req, res) {
  try {
    const id = req.params.id;
    const body = req.body;
    const updated_project = await Project.findByIdAndUpdate(id, body, {
      new: true,
    });
    res.status(200).json(updated_project);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar el proyecto" }); // Agregamos una respuesta de error
  }
}

async function set_favorite(req, res) {
  try {
    const id = req.params.id;
    const updated_project = await Project.findById(id);
    if (!updated_project)
      res.status(404).json({ error: "Proyecto no encontrado" });

    const user = await User.findOne({ _id: req.user });
    if (!user) res.status(404).json({ error: "Usuario no encontrado" });

    const collaboration = user.collaborations.find((collab) =>
      collab.project.equals(updated_project._id)
    );
    if (!collaboration)
      res.status(404).json({ error: "Colaboración no encontrada en usuario." });
    collaboration.favorite = !collaboration.favorite;
    await user.save();

    const collaborator = updated_project.collaborators.find(
      (collaborator) => collaborator.user.toString() === req.user
    );
    updated_project.collaborators = [
      ...updated_project.collaborators.filter(
        (collaborator) => collaborator.user.toString() !== req.user
      ),
      {
        user: req.user,
        favorite: !collaborator.favorite,
        permission: collaborator.permission,
      },
    ];
    await updated_project.save();
    res.status(200).json({
      _id: updated_project.id,
      title: updated_project.title,
      total_progress: updated_project.total_progress,
      color: updated_project.color,
      favorite: updated_project.collaborators.find(
        (collaborator) => collaborator.user.toString() === req.user
      ).favorite,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar el proyecto" }); // Agregamos una respuesta de error
  }
}

async function update_color_project(req, res) {
  try {
    const id = req.params.id;
    const { color } = req.body;
    const updated_project = await Project.findById(id);
    if (updated_project) {
      updated_project.color = color;
      await updated_project.save();
      res.status(200).json(updated_project);
    } else {
      res.status(404).json({ error: "Proyecto no encontrado" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error al actualizar el color del proyecto" }); // Agregamos una respuesta de error
  }
}

async function update_title_project(req, res) {
  try {
    const id = req.params.id;
    const { title } = req.body;
    console.log("TITLE", title);
    const updated_project = await Project.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );
    res.status(200).json(updated_project);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error al actualizar el título del proyecto" }); // Agregamos una respuesta de error
  }
}

async function shared_project(req, res) {
  try {
    const id = req.params.id;
    const { email, permission } = req.body;
    const user_shared = await User.findOne({ email });

    // Obtén el proyecto por su ID y agrega el nuevo colaborador a collaborators
    const updated_project = await Project.findByIdAndUpdate(
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
      return res.status(404).json({ error: "Proyecto no encontrado" });
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

async function list_collaboration_projects(req, res) {
  try {
    const raw_projects = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user),
        },
      },
      { $unwind: "$collaborations" },
      {
        $lookup: {
          from: "projects",
          localField: "collaborations.project",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },
      {
        $project: {
          _id: "$project._id",
          title: "$project.title",
          favorite: "$collaborations.favorite",
          permission: "$collaborations.permission",
          is_deleted: "$project.is_deleted",
          workspace: "$project.workspace",
          total_progress: "$project.total_progress",
          color: "$project.color",
          init_date: "$project.init_date",
          end_date: "$project.end_date",
        },
      },
    ]);
    console.log("🚀 ~ list_collaboration_projects ~ raw_projects:", raw_projects)
    const raw_workspaces = await Workspace.find({ user: req.user });
    const mixed_projects = await MixedProject.aggregate([
      {
        $match: {
            collaborators: { $elemMatch: { user: new mongoose.Types.ObjectId(req.user) } }
        }
      },
      { $unwind: "$collaborators" }, // Deshace el array de colaboradores
      {
          $match: {
              "collaborators.user": new mongoose.Types.ObjectId(req.user) // Filtra solo el colaborador que coincide con req.user
          }
      },
      {
          $project: {
              _id: 1,
              color: "$collaborators.color",
              favorite: "$collaborators.favorite",
              permission: "$collaborators.permission",
              title: 1
          }
      }
    ])
  
    const favoriteProjects = raw_projects.filter(
      (project) => project.favorite && !project.is_deleted
    );
    const trashedProjects = raw_projects.filter(
      (project) => project.is_deleted
    );
    const sharedProjects = raw_projects.filter(
      (project) => project.permission !== "owner"
    );
    const workspaces = raw_workspaces.map((workspace) => {
      const projects = raw_projects.filter(
        (project) => (project.workspace.toString() === workspace._id.toString() && !project.is_deleted)
      );
      return {
        id: workspace._id,
        name: workspace.name,
        projects,
      };
    });

    res.status(200).json({
      projects: raw_projects,
      workspaces,
      sharedProjects,
      trashedProjects,
      favoriteProjects,
      mixedProjects: mixed_projects,
    });
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ error: "Error al obtener TOOOODOS los proyectos" }); // Agregamos una respuesta de error
  }
}

module.exports = {
  list_projects,
  create_project,
  show_project,
  delete_project,
  update_project,
  set_favorite,
  list_collaboration_projects,
  update_color_project,
  shared_project,
  restore_from_trash_project,
  update_title_project,
};
