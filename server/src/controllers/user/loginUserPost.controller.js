import { login } from "../../services/user/login.service.js";
export default async function loginUserPostController(req, res) {
  try {
    const { email, password } = req.body;
    
    const user = await login({ email, password });
    res.status(200).json( user );
  } catch (error) {
    console.error(error);
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })
  }
}
