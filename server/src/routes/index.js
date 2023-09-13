const express = require("express")
const router = express.Router();

const projectRouter = require("../components/projects/routes");

router.use("/projects", projectRouter);

module.exports = router;