import express from "express";
import UserAuth from "../middleware/authentication.js"
import UserAuthorization from "../middleware/authorization.js"
import listProjectsGetController from "../controllers/projects/listProjectsGet.controller.js";
import showProjectGetController from "../controllers/projects/showProjectGet.controller.js";
import createProjectPostController from "../controllers/projects/createProjectPost.controller.js";
import deleteProjectDeleteController from "../controllers/projects/deleteProjectDelete.controller.js";
import updateProjectPatchController from "../controllers/projects/updateProjectPatch.controller.js";
import setFavoriteProjectPatchController from "../controllers/projects/setFavoriteProjectPatch.controller.js";
import listCollaborationProjectsGetController from "../controllers/projects/listCollaborationProjectsGet.controller.js";
import updateTitleProjectPatchController from "../controllers/projects/updateTitleProjectPatch.controller.js";
import updateColorProjectPatchController from "../controllers/projects/updateColorProjectPatch.controller.js";
import sharedProjectPatchController from "../controllers/projects/sharedProjectPatch.controller.js";
import restoreFromTrashProjectPatchController from "../controllers/projects/restoreFromTrashProjectPatch.controller.js";
import generateExcelPostController from "../controllers/projects/generateExcelPost.controller.js";

const router = express.Router()

router.get("/:id_workspace", UserAuth,listProjectsGetController)
router.get("/:id", UserAuth, showProjectGetController)
router.post("/:id_workspace", UserAuth, createProjectPostController)
router.delete("/:id", UserAuth, UserAuthorization.admin_permission, deleteProjectDeleteController)
router.patch("/:id", UserAuth, updateProjectPatchController)
router.patch("/favorite/:id", UserAuth, setFavoriteProjectPatchController)
router.get('/list/collaboration', UserAuth, listCollaborationProjectsGetController)
router.patch("/name/:id", UserAuth, updateTitleProjectPatchController)
router.patch("/color/:id", UserAuth, UserAuthorization.admin_permission, updateColorProjectPatchController)
router.patch("/shared/:id", UserAuth, UserAuthorization.admin_permission, sharedProjectPatchController)
router.patch("/trash/:id", UserAuth, UserAuthorization.admin_permission, restoreFromTrashProjectPatchController)

router.post('/generate-excel/:id', UserAuth, generateExcelPostController)

export default router
