const Activity = require("./model");

async function list_activities(req, res){
  try {
    const id_parent = req.params.id_parent
    const activities = await Activity.find({ parent: id_parent });
    res.status(200).json(activities);
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al obtener la lista de proyectos' });
  }
}

async function create_activity(req, res){
  try {
    const {description, relative_weight, absolute_weight, relative_progress, absolute_progress, index, parent, project} = req.body;
    // TODO: Validations
    const new_activity = new Activity({description, relative_weight, absolute_weight, relative_progress, absolute_progress, index, parent, project});
    await new_activity.save();
    const parent_activity = await Activity.findById(parent)
    if(parent_activity && !parent_activity.has_subactivities){
      parent_activity.has_subactivities = true
      parent_activity.save()
    } 

    res.status(201).json(new_activity)
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al crear el proyecto' }); // Agregamos una respuesta de error
  }
}

async function show_activity(req, res){
  try {
    const id = req.params.id
    const activity = await Activity.findById(id);
    res.status(200).json(activity);
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al obtener el proyecto' });
  }
}

async function delete_activity(req, res){
  try {
    const id = req.params.id
    await Activity.findByIdAndDelete(id);
    res.status(200).json({ message: 'Actividad eliminada' });
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al crear el actividad' }); // Agregamos una respuesta de error  
  } 
}

async function update_activity(req, res){
  try {
    const id = req.params.id;
    const body = req.body;
    const updated_activity = await Activity.findByIdAndUpdate(id, body, { new: true } );
    res.status(200).json(updated_activity);
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al actualizar el proyecto' }); // Agregamos una respuesta de error  
  }
}

module.exports = {
  list_activities,
  create_activity,
  show_activity,
  delete_activity,
  update_activity
}