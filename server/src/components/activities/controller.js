const { deleteDescendantActivities } = require("../../utils.js/delete_associated");
const Activity = require("./model");

async function get_project_or_activity(id){
  const activity = await Activity.findById(id);
  if(activity){
    activity.has_subactivities = true
    activity.save( )
  }
  return activity
}

async function list_activities(req, res){
  try {
    const id_parent = req.params.id_parent
    const activities = await Activity.find({ parent: id_parent });
    res.status(200).json({parent: id_parent, activities});
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al obtener la lista de proyectos' });
  }
}

async function create_activity(req, res){
  let absolute_weight, index;
  try {
    const {description, relative_weight, parent } = req.body;
    const parent_activity = await get_project_or_activity(parent)
    const activities = await Activity.find({ parent: parent });
    console.log("ACTIVITIES", activities);
    const sum_weight = activities.reduce((acc, activity) => acc + activity.relative_weight, 0)+ relative_weight;
    if(!parent_activity){
      index = 1
      absolute_weight = relative_weight/sum_weight
    }else{
      index = parent_activity.index + 1
      absolute_weight = (+relative_weight) * parent_activity.absolute_weight
    }
    // TODO: Validations
    const new_activity = new Activity({description, relative_weight, absolute_weight, index, parent});
    await new_activity.save();
    let absolute_weight_for_each;
    if(activities.length !==0){
      activities.forEach(async(activity) => {
        absolute_weight_for_each = activity.relative_weight/(sum_weight)
        await Activity.findByIdAndUpdate(activity._id, {absolute_weight: absolute_weight}, { new: true } )
      })
    }
    if(parent_activity && !parent_activity.has_subactivities){
      parent_activity.has_subactivities = true
      parent_activity.save()
    } 

    res.status(201).json(new_activity)
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al crear la actividad' });
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
    // TODO: Debe eliminar tambien todos los hijos que tenga
    const id = req.params.id
    // Llama a la función para eliminar actividades descendientes
    await deleteDescendantActivities(id);
    // Elimina la actividad padre
    await Activity.findByIdAndDelete(id);
    res.status(200).json({ message: 'Actividad y todas las subactividades eliminadas' });
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ error: 'Error al eliminar la actividad y subactividades' });
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