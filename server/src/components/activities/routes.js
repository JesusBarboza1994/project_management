const express = require("express");
const router = express.Router();
const UserAuth = require("../../middleware/auth")

const controller = require("./controller");
router.get("/:id_parent", UserAuth, controller.list_activities)
router.post("/", UserAuth, controller.create_activity)
router.get("/id/:id", UserAuth, controller.show_activity)
router.delete("/:id", UserAuth, controller.delete_activity)
router.patch("/:id", UserAuth, controller.update_activity)

module.exports = router