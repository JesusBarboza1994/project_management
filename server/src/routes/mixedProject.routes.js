import express from "express";
import UserAuth from "../middleware/authentication.js"
import createMixedProjectPostController from "../controllers/mixedProjects/createMixedProjectPost.controller.js";
import shareMixedProjectPatchController from "../controllers/mixedProjects/shareMixedProjectPatch.controller.js";
import filterMixedProjectActivitiesPostController from "../controllers/mixedProjects/filterMixedProjectActivitiesPost.controller.js";
import generateExcelMixedProjectPostController from "../controllers/mixedProjects/generateExcelMixedProjectPost.controller.js";

const router = express.Router();

router.post('/', UserAuth ,createMixedProjectPostController)
router.patch('/shared/:id', UserAuth, shareMixedProjectPatchController)
router.post('/:id', UserAuth, filterMixedProjectActivitiesPostController)
router.post('/generate-excel/:id', UserAuth, generateExcelMixedProjectPostController)

export default router
