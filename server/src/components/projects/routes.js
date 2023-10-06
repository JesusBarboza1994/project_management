const express = require("express");
const router = express.Router();
const UserAuth = require("../../middleware/auth");

const controller = require("./controller");
router.get("/:id_workspace", UserAuth,controller.list_projects)
router.get("/:id", UserAuth, controller.show_project)
router.post("/:id_workspace", UserAuth, controller.create_project)
router.delete("/:id", UserAuth, controller.delete_project)
router.patch("/:id", UserAuth, controller.update_project)
router.patch("/favorite/:id", UserAuth, controller.set_favorite)
module.exports = router