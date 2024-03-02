const express = require("express");
const router = express.Router();
const UserAuth = require("../../middleware/authentication")
const UserAuthorization = require("../../middleware/authorization");

const controller = require("./controller");
router.post('/', UserAuth ,controller.create_mixed_project)
router.get('/:id', UserAuth, controller.show_mixed_project)
module.exports = router