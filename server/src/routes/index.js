const express = require("express")
const router = express.Router();

const projectRouter = require("../components/projects/routes");
const workspaceRouter = require("../components/workspaces/routes");
const activityRouter = require("../components/activities/routes");
const userRouter = require("../components/users/routes");
const mixedProjectRouter = require("../components/mixedProjects/routes");

router.use("/projects", projectRouter);
router.use("/workspaces", workspaceRouter);
router.use("/activities", activityRouter);
router.use("/users", userRouter);
router.use("/mixed-projects", mixedProjectRouter);
module.exports = router;