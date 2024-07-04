import express from "express";
import loginUserPostController from "../controllers/user/loginUserPost.controller.js";

const router = express.Router();

router.post("/login", loginUserPostController)

export default router