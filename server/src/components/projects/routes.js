const express = require("express");
const router = express.Router();
const UserAuth = require("../../middleware/authentication");
const UserAuthorization = require("../../middleware/authorization");
const controller = require("./controller");
router.get("/:id_workspace", UserAuth,controller.list_projects)
router.get("/:id", UserAuth, controller.show_project)
router.post("/:id_workspace", UserAuth, controller.create_project)
router.delete("/:id", UserAuth, UserAuthorization.admin_permission,controller.delete_project)
router.patch("/:id", UserAuth, controller.update_project)
router.patch("/favorite/:id", UserAuth, controller.set_favorite)
router.patch("/color/:id", UserAuth, controller.update_color_project)
router.patch("/shared/:id", UserAuth, UserAuthorization.admin_permission,controller.shared_project)
module.exports = router