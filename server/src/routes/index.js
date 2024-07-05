import express from "express"
import projectRouter from "./project.routes.js"
import workspaceRouter from "./workspace.routes.js"
import activityRouter from "./activity.routes.js"
import userRouter from "./user.routes.js"
import mixedProjectRouter from "./mixedProject.routes.js"

const router = express.Router();

router.use("/users", userRouter);
router.use("/projects", projectRouter);
router.use("/workspaces", workspaceRouter);
router.use("/mixed-projects", mixedProjectRouter);
// TODO: Continuar el traspaso aquí
router.use("/activities", activityRouter);

export default router
