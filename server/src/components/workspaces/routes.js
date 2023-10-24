const express = require("express");
const router = express.Router();
const UserAuth = require("../../middleware/authentication")
const controller = require("./controller");

router.post("/", UserAuth, controller.create_workspace)
router.get("/", UserAuth, controller.list_workspaces)
router.get("/:id", UserAuth, controller.show_workspace)
router.delete("/:id", UserAuth, controller.delete_workspace)
router.patch("/:id", UserAuth, controller.update_workspace)

module.exports = router