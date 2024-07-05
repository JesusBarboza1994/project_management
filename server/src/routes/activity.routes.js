import express from "express";
import UserAuth from "../middleware/authentication.js"
import UserAuthorization from "../middleware/authorization.js"
import listTreeActivitiesGetController from "../controllers/activity/listTreeActivitiesGet.controller.js";
import listActivitiesGetController from "../controllers/activity/listActivitiesGet.controller.js";
import createActivityPostController from "../controllers/activity/createActivityPost.controller.js";
import showActivityGetController from "../controllers/activity/showActivityGet.controller.js";
import updateNameActivityPatchController from "../controllers/activity/updateNameActivityPatch.controller.js";
import deleteActivityDeleteController from "../controllers/activity/deleteActivityDelete.controller.js";
import updateActivityPatchController from "../controllers/activity/updateActivityPatch.controller.js";
import listAllActivitiesByProjectPostController from "../controllers/activity/listAllActivitiesByProjectPostController.js";

const router = express.Router();

router.get("/:id_parent", UserAuth, listActivitiesGetController)
router.post("/", UserAuth,UserAuthorization.edit_permission, createActivityPostController)
router.get("/id/:id", UserAuth, showActivityGetController)
router.delete("/:id", UserAuth, UserAuthorization.edit_permission, deleteActivityDeleteController)
router.patch("/:id", UserAuth, UserAuthorization.edit_permission, updateActivityPatchController)
router.patch("/title/:id", UserAuth, UserAuthorization.edit_permission, updateNameActivityPatchController)
router.get('/tree/:id', UserAuth, listTreeActivitiesGetController)
router.post('/table/:id', UserAuth, listAllActivitiesByProjectPostController)

export default router