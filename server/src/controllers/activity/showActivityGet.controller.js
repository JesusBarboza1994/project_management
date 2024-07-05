export default async function showActivityGetController(req, res){
  try {
    const id = req.params.id
    const activity = await Activity.findById(id);
    res.status(200).json(activity);
  } catch (error) {
    console.log("ERROR",error)
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })
  }
}