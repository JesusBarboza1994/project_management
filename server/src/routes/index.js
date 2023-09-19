const express = require("express")
const router = express.Router();

const projectRouter = require("../components/projects/routes");
const workspaceRouter = require("../components/workspaces/routes");
const activityRouter = require("../components/activities/routes");

router.use("/projects", projectRouter);
router.use("/workspaces", workspaceRouter);
router.use("/activities", activityRouter);
module.exports = router;