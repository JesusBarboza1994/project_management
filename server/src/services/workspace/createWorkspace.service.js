import Workspace from "../../models/workspace.model.js";

export async function createWorkspace({ name, user }){
  const newWorkspace = Workspace.create({
    name,
    user
  })
  return newWorkspace
}