import Project from "../../models/project.model.js";
import User from "../../models/user.model.js"
import mongoose from "mongoose"
export async function listUsers({user, search, id}){
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
  return {users: filter_users, collaborators}
}