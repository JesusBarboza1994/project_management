export default async function removeCollaboratorDeleteController(req, res) {
  try {
    const { id, email } = req.query;
    const project = await removeCollaborator({id, email});

    res.status(200).json({ collaborators: project.collaborators, message: 'Colaborador eliminado correctamente' });
    
  } catch (error) {
    console.error(error);
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })
  }
}