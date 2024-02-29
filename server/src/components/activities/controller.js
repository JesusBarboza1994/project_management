const { deleteDescendantActivities } = require("../../utils.js/delete_associated");
const Project = require("../projects/model");
const Activity = require("./model");

async function list_tree_activities(req, res){
  try {
    const id = req.params.id
    const activities = await listActivitiesRecursively(id)
    if(activities.length === 0) return res.status(200).json([]);
    res.status(200).json(activities);
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al obtener la lista de proyectos' });
  }
}

async function listActivitiesRecursively(id) {
  const activities = await Activity.find({ parent: id }).lean()
  if(activities.length === 0) return []
  for (const activity of activities) {
    activity.activities = await listActivitiesRecursively(activity._id);
  }
  return activities
}
async function list_activities(req, res){
  try {
    const id_parent = req.params.id_parent
    const activities = await Activity.find({ parent: id_parent });
    const project = await Project.findById(id_parent)
    if(!project) return res.status(200).json({parent: id_parent, activities});
    const collaborator = project.collaborators.find(collaborator => collaborator.user.toString() === req.user) 
    if(!collaborator) return res.status(400).json({message: "No tienes acceso a este proyecto"})
    const permission = collaborator.permission
    res.status(200).json({parent: id_parent, activities, permission});
    
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al obtener la lista de proyectos' });
  }
}

async function create_activity(req, res){
  let absolute_weight, index;
  try {
    const {title, relative_weight, parent } = req.body;
    console.log("TITLE", title)
    const parent_activity = await Activity.findById(parent);
    const activities_same_parent = await Activity.find({ parent: parent });
    const sum_weight = activities_same_parent.reduce((acc, activity) => acc + activity.relative_weight, 0) + relative_weight;
    let init_date
    if(!parent_activity){
      index = 1
      absolute_weight = relative_weight/sum_weight
      const project = await Project.findById(parent);
      if(project.init_date){
        init_date = project.init_date
      }else{
        init_date = new Date()
      }
    }else{
      if(parent_activity.init_date){
        init_date = parent_activity.init_date
      }else{
        init_date = new Date()
      }
      index = parent_activity.index + 1
      absolute_weight = (+relative_weight/sum_weight) * parent_activity.absolute_weight
    }
    relative_weight_percentage = relative_weight/sum_weight
    const end_date = init_date
    
    // Crear la actividad
    const new_activity = new Activity({title, relative_weight, absolute_weight, index, parent, relative_weight_percentage, init_date, end_date});
    await new_activity.save();
    // // Actualizar los datos de las actividades hermanas
    // if(activities_same_parent.length !==0) await update_activities_with_same_parent(activities_same_parent, parent_activity, sum_weight)
    // Actualizar pesos relativos de las actividades hermanas
    const updated_activities_same_parent = await Activity.find({ parent });
    updated_activities_same_parent.forEach(async(activity) => {
      await Activity.findByIdAndUpdate(activity._id, {
        relative_weight_percentage: activity.relative_weight / sum_weight
      })
    })

    const parent_absolute_weight = parent_activity ? parent_activity.absolute_weight : 1;
    // Llamamos a la función recursiva para actualizar las actividades descendientes
    await updateActivityRecursively(new_activity, parent_absolute_weight);
    
    // Actualizar actividades de la cadena superior (padre en adelante)
    const total_progress = await updateParentActivities(new_activity.parent);
    
    // Actualizar SOLO a la actividad padre
    if(parent_activity && !parent_activity.has_subactivities){
      await Activity.findByIdAndUpdate(parent_activity._id, {has_subactivities: true,
        relative_progress: 0,
        absolute_progress: 0
      }, { new: true } )
      
    } 

    res.status(201).json({
      message: "Create activity succesfully",
      project:{
        ...total_progress
      }
    })
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
    const id = req.params.id
    // Actividad a eliminar (donde se dió click)
    const current_activity = await Activity.findById(id);
    // El parent puede ser Project o Activity, si es project va a retornar null
    const parent_activity = await Activity.findById(current_activity.parent);
    
    // Llama a la función para eliminar actividades descendientes
    await deleteDescendantActivities(id);
    // Elimina la actividad actual
    await Activity.findByIdAndDelete(id);
    // Actualiza actividades hermanas
    // Actividades hermanas, nunca será null porque siempre tendra contenido a la actividad principal
    const activities_same_parent = await Activity.find({ parent: current_activity.parent });
    const sum_weight = activities_same_parent.reduce((acc, activity) => acc + activity.relative_weight, 0) 
    activities_same_parent.forEach(async(activity) => {
      await Activity.findByIdAndUpdate(activity._id, {
        relative_weight_percentage: activity.relative_weight / sum_weight
      })
    })
    const parent_absolute_weight = parent_activity ? parent_activity.absolute_weight : 1;
    // Llamamos a la función recursiva para actualizar las actividades descendientes
    await updateActivityRecursively(current_activity, parent_absolute_weight);
    // Actualizar actividades de la cadena superior (padre en adelante)
    const total_progress = await updateParentActivities(current_activity.parent);
  
    res.status(200).json(
      {
        message: "Delete activity succesfully",
        project:{
          ...total_progress
        }
      }
    )
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ error: 'Error al eliminar la actividad y subactividades' });
  }
}
async function update_name_activity(req, res){
  try {
    const id = req.params.id;
    const { title } = req.body;
    const activity = await Activity.findByIdAndUpdate(id, { title }, { new: true });
    res.status(200).json(activity);
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ error: 'Error al actualizar el nombre de la actividad' });
  }
}
async function update_activity(req, res){
  const id = req.params.id;
  const { relative_weight, relative_progress, init_date, end_date } = req.body;

  const current_activity = await Activity.findByIdAndUpdate(id, { relative_weight }, { new: true });
  if(!current_activity.has_subactivities) {
    await Activity.findByIdAndUpdate(id, {init_date: formatStringToDate(init_date), end_date: formatStringToDate(end_date)}, { new: true });
  }
  const parent_activity = await Activity.findById(current_activity.parent);
  const activities_same_parent = await Activity.find({ parent: current_activity.parent });
  const sum_weight = activities_same_parent.reduce((acc, act) => acc + act.relative_weight, 0);
  // Actualizar pesos relativos de las actividades hermanas
  activities_same_parent.forEach(async(activity) => {
    await Activity.findByIdAndUpdate(activity._id, {
      relative_weight_percentage: activity.relative_weight / sum_weight
    })
  })
  const parent_absolute_weight = parent_activity ? parent_activity.absolute_weight : 1;
  // Llamamos a la función recursiva para actualizar las actividades descendientes
  await updateActivityRecursively(current_activity, parent_absolute_weight);
  const updated_current_activity = await Activity.findById(id);
  if(+relative_progress !== updated_current_activity.relative_progress && +relative_progress !== 0 && !updated_current_activity.has_subactivities){
    await Activity.findByIdAndUpdate(id, {relative_progress, absolute_progress: relative_progress*updated_current_activity.absolute_weight}, { new: true });
  }
  // Actualizar actividades de la cadena superior (padre en adelante)
  const parent_result = await updateParentActivities(current_activity.parent);
  // Devolvemos la actividad actualizada
  console.log("PARENT", parent_result)
  res.status(200).json(
    {
      message: "Update activity succesfully",
      project:{
        ...parent_result
      }
    }
  );
}



async function updateParentActivities(activityId) {
  const activity = await Activity.findById(activityId);
  if (!activity) {
    const main_activities = await Activity.find({ parent: activityId });
    const init_date = main_activities.map(activity => activity.init_date).sort((a, b) => a - b)[0];
    const end_date = main_activities.map(activity => activity.end_date).sort((a, b) => a - b)[main_activities.length-1];
    const {total_progress}=  await Project.findByIdAndUpdate(activityId, { init_date, end_date,total_progress: main_activities.reduce((acc, act) => acc + act.absolute_progress, 0) }, { new: true });
    return {total_progress, init_date, end_date}; // Terminar si no se encuentra la actividad
  }

  // Actualizar la actividad actual
  const activities_same_parent = await Activity.find({ parent: activity._id });
  const init_date = activities_same_parent.map(activity => activity.init_date).sort((a, b) => a - b)[0];
  const end_date = activities_same_parent.map(activity => activity.end_date).sort((a, b) => a - b)[activities_same_parent.length-1];
  const absolute_progress = activities_same_parent.reduce((acc, act) => acc + act.absolute_progress, 0);
  await Activity.findByIdAndUpdate(activity._id, { absolute_progress, init_date, end_date });

  // Obtener la actividad padre y llamar recursivamente
  const parentActivity = await Activity.findById(activity.parent);
  if (parentActivity) {
    return await updateParentActivities(parentActivity._id);
  }else{
    const main_activities = await Activity.find({ parent: activity.parent });
    const {total_progress, init_date, end_date}=  await Project.findByIdAndUpdate(activity.parent, { total_progress: main_activities.reduce((acc, act) => acc + act.absolute_progress, 0) }, { new: true });
    return {total_progress, init_date, end_date};
  }
}


async function updateActivityRecursively(activity, parent_absolute_weight) {
  const parent_activity = await Activity.findById(activity.parent);
  const activities_same_parent = await Activity.find({ parent: activity.parent });
  const sum_weight = activities_same_parent.reduce((acc, act) => acc + act.relative_weight, 0);
  
  let totalAbsoluteProgress = 0;
  for (const act of activities_same_parent) {
    act.absolute_weight = act.relative_weight_percentage * (parent_activity ? parent_absolute_weight : 1);
    
    
    if (!act.has_subactivities) {
      act.absolute_progress = act.absolute_weight * act.relative_progress;
    } else {
      const subactivities = await Activity.find({ parent: act._id });
      let sumAbsoluteProgress = 0;
      for (const subactivity of subactivities) {
        subactivity.absolute_weight = subactivity.relative_weight_percentage * act.absolute_weight;
        if (!subactivity.has_subactivities) {
          subactivity.absolute_progress = subactivity.absolute_weight * subactivity.relative_progress;
        } else {
          const sub_subactivities = await Activity.find({ parent: subactivity._id });
          subactivity.absolute_progress = await updateActivityRecursively(sub_subactivities[0], subactivity.absolute_weight);
        }
        
        sumAbsoluteProgress += subactivity.absolute_progress;
        await subactivity.save();
      }

      act.absolute_progress = sumAbsoluteProgress;
    }

    await act.save();

    totalAbsoluteProgress += act.absolute_progress;
  }

  return totalAbsoluteProgress;
}

async function calculateSumWeight(parentId) {
  const activities = await Activity.find({ parent: parentId });
  return activities.reduce((acc, activity) => acc + activity.relative_weight, 0);
}

async function calculateAbsoluteProgress(activityId) {
  const subActivities = await Activity.find({ parent: activityId });
  return subActivities.reduce((acc, subActivity) => {
    return acc + subActivity.has_subactivities ? calculateAbsoluteProgress(subActivity._id) : (subActivity.absolute_weight * subActivity.relative_progress);
  }, 0);
}

async function update_activities_with_same_parent(activities, parent_activity, sum_weight){
  let absolute_weight
  let relative_weight_percentage
  activities.forEach(async(activity) => { 
    absolute_weight = parent_activity ? 
      activity.relative_weight/sum_weight * parent_activity.absolute_weight : 
      activity.relative_weight/sum_weight
    relative_weight_percentage = activity.relative_weight/sum_weight
    absolute_progress =  absolute_weight * activity.relative_progress
    await Activity.findByIdAndUpdate(activity._id, {absolute_weight, relative_weight_percentage, absolute_progress}, { new: true } )
  })
}
function formatStringToDate(string){
  if(string.includes("T")) return new Date(string)
  const [año, mes, dia] = string.split('-').map(Number); // Divide la cadena y convierte a números
  // Nota: Restamos 1 al mes ya que los meses en JavaScript se indexan desde 0 (enero) a 11 (diciembre)
  return new Date(año, mes - 1, dia);
  }
module.exports = {
  list_activities,
  list_tree_activities,
  create_activity,
  show_activity,
  delete_activity,
  update_activity,
  update_name_activity
}