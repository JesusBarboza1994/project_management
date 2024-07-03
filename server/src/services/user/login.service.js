import bcrypt from 'bcrypt';
import User from "../../models/user.model.js";
import { CustomError } from "../../utils.js/customError.js";

export async function login({ email, password }){
  const user = await User.findOne({ email });

  if (!user) throw new CustomError("Usuario o contraseña incorrectos", 400, 'INVALID_CREDENTIALS')

  // Verificar la contraseña utilizando bcrypt.compare
  const match = await bcrypt.compare(password, user.password);
  console.log('USER', user)
  if (!match) throw new CustomError("Usuario o contraseña incorrectos", 400, 'INVALID_CREDENTIALS')

  const token = await generateToken({user})
  return { token, user: {
    username: user.username,
    email: user.email
  } }
}