const express = require("express");
const router = express.Router();

const controller = require("./controller");
router.get("/", controller.list_projects)
router.post("/", controller.create_project)

module.exports = router