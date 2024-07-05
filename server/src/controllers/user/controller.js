const bcrypt = require("bcrypt");
const User = require("../../models/user.model");
const Project = require("../../models/project.model");

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

module.exports = {
  create_user_admin,
  removeCollaborator,
}