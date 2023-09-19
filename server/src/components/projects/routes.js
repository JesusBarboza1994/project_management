const express = require("express");
const router = express.Router();

const controller = require("./controller");
router.get("/", controller.list_projects)
router.get("/:id", controller.show_project)
router.post("/", controller.create_project)
router.delete("/:id", controller.delete_project)
router.patch("/:id", controller.update_project)

module.exports = router