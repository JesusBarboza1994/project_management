const express = require("express");
const router = express.Router();

const controller = require("./controller");
router.post("/", controller.create_workspace)
router.get("/", controller.list_workspaces)
router.get("/:id", controller.show_workspace)
router.delete("/:id", controller.delete_workspace)
router.patch("/:id", controller.update_workspace)

module.exports = router