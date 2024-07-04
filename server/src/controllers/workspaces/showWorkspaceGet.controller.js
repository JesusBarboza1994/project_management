import { showWorkspace } from "../../services/workspace/showWorkspace.js";

export default async function showWorkspaceGetController(req, res) {
  try {
    const workspace = await showWorkspace({id: req.params.id, user: req.user._id})
    res.status(200).json(workspace);
  } catch (error) {
    console.log("ERROR",error)
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })  
  }
}