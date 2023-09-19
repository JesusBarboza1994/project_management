const express = require("express");
const router = express.Router();

const controller = require("./controller");
router.get("/:id_parent", controller.list_activities)
router.post("/", controller.create_activity)
router.get("/id/:id", controller.show_activity)
router.delete("/:id", controller.delete_activity)
router.patch("/:id", controller.update_activity)

module.exports = router