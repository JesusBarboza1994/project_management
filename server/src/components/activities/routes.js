const express = require("express");
const router = express.Router();
const UserAuth = require("../../middleware/authentication")
const UserAuthorization = require("../../middleware/authorization");

const controller = require("./controller");
router.get("/:id_parent", UserAuth, controller.list_activities)
router.post("/", UserAuth,UserAuthorization.edit_permission, controller.create_activity)
router.get("/id/:id", UserAuth, controller.show_activity)
router.delete("/:id", UserAuth, UserAuthorization.edit_permission, controller.delete_activity)
router.patch("/:id", UserAuth, UserAuthorization.edit_permission, controller.update_activity)
router.patch("/title/:id", UserAuth, UserAuthorization.edit_permission, controller.update_name_activity)
module.exports = router