import { createUser } from "../../services/user/createUser.service.js";

export default async function createUserPostController(req, res) {
  try {
    const { username, email, password } = req.body;
    const newUser = await createUser({username, email, password});
    
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })
  }
}