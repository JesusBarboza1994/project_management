const express = require("express");
const router = express.Router();
const UserAuth = require("../../middleware/auth");

const controller = require("./controller");
router.get("/", UserAuth,controller.list_projects)
router.get("/:id", UserAuth, controller.show_project)
router.post("/", UserAuth, controller.create_project)
router.delete("/:id", UserAuth, controller.delete_project)
router.patch("/:id", UserAuth, controller.update_project)

module.exports = router