import bcrypt from "bcrypt";
import User from "../../models/user.model.js";
import { CustomError } from "../../utils/customError.js";
import { generateToken } from "../../utils/generateToken.js";

export async function createUser({username, email, password}){
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) throw new CustomError('Usuario o correo electrónico ya existen', 400, 'INVALID_CREDENTIALS');

  const saltRounds = 10; // Número de rondas de cifrado
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = await User.create({ username, email, password: hashedPassword, user_type: 'user' });
  await generateToken({user: newUser})
  return newUser
}