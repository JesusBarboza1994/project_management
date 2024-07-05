import express from "express";
import loginUserPostController from "../controllers/user/loginUserPost.controller.js";
import UserAuth from "../middleware/authentication.js"
import createUserPostController from "../controllers/user/createUserPost.controller.js";
import removeCollaboratorDeleteController from "../controllers/user/removeCollaboratorDelete.controller.js";
import listUsersGetController from "../controllers/user/listUsersGet.controller.js";

const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: login
 *     description: Inicia sesión de un usuario registrado.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *           required:
 *             - email
 *             - password
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Devuelve el usuario y un token de acceso.
 *       400:
 *         description: Error en la solicitud, usuario no encontrado o contraseña incorrecta.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/login", loginUserPostController)
router.post("/signup", createUserPostController)
router.get('/', UserAuth, listUsersGetController)
// router.post("/signup-admin", controller.create_user_admin)
router.delete('/collaborators', UserAuth, removeCollaboratorDeleteController)

export default router
