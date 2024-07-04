import mongoose from "mongoose";
import User from "../../models/user.model.js";
import Workspace from "../../models/workspace.model.js";

export async function listCollaborationProjects({user}){
  const rawProjects = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(user),
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
  ])

  const rawWorkspaces = await Workspace.find({ user });
  const mixedProjects = await User.aggregate([
    {
      $match:{
        collaborators: {$elemMatch: {user: new mongoose.Types.ObjectId(user)}}
      }
    },
    { $unwind: "$collaborators" },
    {
      $match: {
        "collaborators.user": new mongoose.Types.ObjectId(user)
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

  const favoriteProjects = rawProjects.filter((project) => project.favorite && !project.is_deleted);
  const trashedProjects = rawProjects.filter((project) => project.is_deleted);
  const sharedProjects = rawProjects.filter((project) => project.permission !== 'owner');
  const workspaces = rawWorkspaces.map((workspace) => {
    const projects = rawProjects.filter(
      (project) => project.workspace.toString() === workspace._id.toString() && !project.is_deleted
    )

    return {
      id: workspace._id,
      name: workspace.name,
      projects
    }
  })

  return {
    projects: rawProjects,
    workspaces,
    sharedProjects,
    trashedProjects,
    favoriteProjects,
    mixedProjects: mixedProjects,
  }
}
