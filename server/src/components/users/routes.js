const express = require("express");
const router = express.Router();

const controller = require("./controller");
router.post("/signup-admin", controller.create_user_admin)
router.post("/login", controller.login)

module.exports = router