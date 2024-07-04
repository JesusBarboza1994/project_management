import express from "express";
import UserAuth from "../middleware/authentication.js"
import createWorkspacePostController from "../controllers/workspaces/createWorkspacePost.controller.js";
import listWorkspacesGetController from "../controllers/workspaces/listWorkspacesGet.controller.js";
import showWorkspaceGetController from "../controllers/workspaces/showWorkspaceGet.controller.js";
import deleteWorkspaceDeleteController from "../controllers/workspaces/deleteWorkspaceDelete.controller.js";
import updateWorkspacePatchController from "../controllers/workspaces/updateWorkspacePatch.controller.js";

const router = express.Router();

router.post("/", UserAuth, createWorkspacePostController)
router.get("/", UserAuth, listWorkspacesGetController)
router.get("/:id", UserAuth, showWorkspaceGetController)
router.delete("/:id", UserAuth, deleteWorkspaceDeleteController)
router.patch("/:id", UserAuth, updateWorkspacePatchController)

export default router
