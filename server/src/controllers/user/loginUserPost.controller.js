export default async function loginUserPostController(req, res) {
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