import { listWorkspaces } from "../../services/workspace/listWorkspaces.service.js";

export default async function listWorkspacesGetController(req, res) {
  try {
    const { user } = req
    const {workspaces:workspaceList, favoriteProjects:favorite_projects, sharedProjects:real_shared_projects, trashedProjects:trash_projects} = listWorkspaces({user})

    res.status(200).json({workspaces:workspaceList, favoriteProjects:favorite_projects, sharedProjects:real_shared_projects, trashedProjects:trash_projects});
  } catch (error) {
    console.log("ERROR",error);
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })  
  }
}