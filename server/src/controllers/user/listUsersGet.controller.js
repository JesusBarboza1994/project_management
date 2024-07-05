import { listUsers } from "../../services/user/listUsers.service.js";

export default async function listUsersGetController(req, res) {
  try {
    let { search, id } = req.query;
    const { user } = req
    if(!search) search = '';
    const {users, collaborators} = await listUsers({user, search, id});
    
    return res.status(200).json({users, collaborators});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
}