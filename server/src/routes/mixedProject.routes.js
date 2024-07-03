const express = require("express");
const router = express.Router();
const UserAuth = require("../../middleware/authentication")

const controller = require("./controller");
router.post('/', UserAuth ,controller.create_mixed_project)
router.post('/:id', UserAuth, controller.filter_mixed_project_activities)
router.patch('/shared/:id', UserAuth, controller.shared_mixed_project)
router.post('/generate-excel/:id', UserAuth, controller.generate_excel_mixed_project)
module.exports = router