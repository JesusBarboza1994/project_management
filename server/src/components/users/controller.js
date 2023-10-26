const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("./model");

async function create_user_admin(req, res){
  try {
    const {username, email, password} = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuario o correo electrónico ya existen' });
    }

    const saltRounds = 10; // Número de rondas de cifrado
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const new_user = new User({ username, email, password: hashedPassword, user_type: 'admin' });
    await new_user.save();

    res.status(201).json(new_user)
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al crear el usuario' }); // Agregamos una respuesta de error
  }
}
async function create_user(req, res) {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuario o correo electrónico ya existen' });
    }
    const saltRounds = 10; // Número de rondas de cifrado
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const new_user = new User({ username, email, password: hashedPassword, user_type: 'user' });
    await new_user.save();
    res.status(201).json(new_user);
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al crear el usuario' }); // Agregamos una respuesta de error
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    // Buscar al usuario por correo electrónico
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Usuario o correo electrónico no existen' });
    }

    // Verificar la contraseña utilizando bcrypt.compare
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

     // Generar un token JWT con un vencimiento de 2 horas
     const token = jwt.sign({ userId: user._id, userType: user.user_type }, process.env.SECRET_ACCESS_KEY_TOKEN, { expiresIn: process.env.APP_SECRET_ACCESS_TIME });
      user.token = token;
      user.tokenCreatedAt = new Date();
      user.tokenExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 horas en milisegundos
      await user.save();
    res.status(200).json( user );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

async function logout(req, res){

}

module.exports = {
  create_user_admin,
  create_user,
  login,
  logout
}