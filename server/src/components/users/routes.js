const express = require("express");
const router = express.Router();

const controller = require("./controller");

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
router.post("/login", controller.login)
router.post("/signup-admin", controller.create_user_admin)

module.exports = router