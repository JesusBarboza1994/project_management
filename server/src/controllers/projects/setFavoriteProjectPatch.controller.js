import { setFavoriteProject } from "../../services/project/setFavorite.service.js";

export default async function setFavoriteProjectPatchController(req, res) {
  try {
    const id = req.params.id;
    const userId = req.user;
    const updateProject = await setFavoriteProject({ id, userId });
    console.log("🚀 ~ setFavoriteProjectPatchController ~ updateProject:", updateProject)

    res.status(200).json({
      _id: updateProject.id,
      title: updateProject.title,
      total_progress: updateProject.total_progress,
      color: updateProject.color,
      favorite: updateProject.collaborators.find(
        (collaborator) => collaborator.user.toString() === req.user
      ).favorite,
    });

  } catch (error) {
    console.log(error);
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })  
  }
}
