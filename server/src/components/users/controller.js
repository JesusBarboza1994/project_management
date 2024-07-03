const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../../models/user.model");
const Project = require("../../models/project.model");
const mongoose = require('mongoose');


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
    if (existingUser) return res.status(400).json({ error: 'Usuario o correo electrónico ya existen' });
    
    const saltRounds = 10; // Número de rondas de cifrado
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const new_user = await User.create({ username, email, password: hashedPassword, user_type: 'user' });
    await generateToken({user: new_user})
    return res.status(201).json(new_user);
  } catch (error) {
    console.log("ERROR",error)
    return res.status(500).json({ error: 'Error al crear el usuario' }); // Agregamos una respuesta de error
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

    await generateToken({user})
    res.status(200).json( user );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

async function listUsers(req, res) {
  try {
    let { search, id } = req.query;
    console.log("🚀 ~ listUsers ~ id:", id)
    const { user } = req
    if(!search) search = '';
    
    const users = await User.find(
      {$and: [
        { _id: { $ne: user } }, // Excluye al usuario con el ID especificado
        { $or: [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ]}
    ]}
    ).select('email username');

    if(id==="none"){
      return res.status(200).json({users});
    }

    const objectId = new mongoose.Types.ObjectId(id);
    const collaborators = await Project.aggregate([
      { $match: { _id: objectId } },
      {
        $project: {
          collaborators: 1,
        },
      },
      {
        $unwind: "$collaborators",
      },
      {
        $lookup: {
          from: "users",
          localField: "collaborators.user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: "$user._id",
          permission: "$collaborators.permission",
          email: "$user.email",
          username: "$user.username"
        },
      },
      ])
    const filter_users = users.filter(user => {
      const emails = collaborators.map(collaborator => collaborator.email);
      return !emails.includes(user.email);
    })
    return res.status(200).json({users: filter_users, collaborators});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
}

async function removeCollaborator(req, res) {
  try {
    const { id, email } = req.query;
    const project = await Project.findById(id);
    const user = await User.findOne({email});
    if (!project || !user) return res.status(404).json({ error: 'Proyecto o usuario no encontrado' });
    
    project.collaborators = project.collaborators.filter(collaborator => collaborator.user.toString() !== user._id.toString());
    console.log("🚀 ~ removeCollaborator ~ project:", project)
    await project.save();
    
    res.status(200).json({ collaborators: project.collaborators,message: 'Colaborador eliminado correctamente' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el colaborador' });
  }
}

async function generateToken({user}){
  console.log("🚀 ~ generateToken ~ user:", user)
  // Generar un token JWT con un vencimiento de 12 horas
  const token = jwt.sign({ userId: user._id, userType: user.user_type }, process.env.SECRET_ACCESS_KEY_TOKEN, { expiresIn: process.env.APP_SECRET_ACCESS_TIME });
  user.token = token;
  user.tokenCreatedAt = new Date();
  user.tokenExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 horas en milisegundos
  await user.save();
}

module.exports = {
  create_user_admin,
  listUsers,
  removeCollaborator,
  create_user,
  login
}