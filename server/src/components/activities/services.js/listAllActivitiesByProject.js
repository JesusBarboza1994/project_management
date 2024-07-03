import mongoose from "mongoose";
import Project from "../../../models/project.model.js";
import Activity from "../../../models/activity.model.js";

export async function listAllActivitiesByProject({id, order, search, date, relative_progress}) {
  const project_data = await Project.aggregate([
    {
      $match: {
        _id: new mongoose.default.Types.ObjectId(id)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "collaborators.user",
        foreignField: "_id",
        as: "users"
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        "users.username": 1
      }
    }
  ])
  return await list_all_activities_of_project({id, title: project_data[0].title, users: project_data[0].users, filter_order:order, search, date, relative_progress})
 
}

async function list_all_activities_of_project({id, title, users, filter_order, search, date, relative_progress}){
  let complete_activities = []
  async function obtener_actividades_recursivas({parentId, order=0}){
    let query = { parent: parentId }
    if(search && search !== "") query.title = { $regex: search, $options: "i" }
    if(date && date !== ""){
      query.init_date = { $lte: new Date(date) }
      query.end_date = { $gte: new Date(date) }
    }
    if(relative_progress) query.relative_progress = { $gte: relative_progress }
    
    const found_activities = await Activity.find(query).select('title relative_progress relative_weight init_date end_date order has_subactivities').lean();
    if(found_activities.length===0) return
    found_activities.forEach(activity => {
      activity.project = title
      activity.users = users
      const duration = Math.ceil((activity.end_date - activity.init_date)/(24 * 60 * 60 * 1000)) 
      activity.duration = duration === 0 ? 1 : duration 
    })

    complete_activities = [...complete_activities, ...found_activities]
    let order_of_activities = (found_activities[0].order.length > order ) ? found_activities[0].order.length : order
    if(filter_order && order_of_activities === filter_order) return order_of_activities
    for await (const activity of found_activities) {
      const response = await obtener_actividades_recursivas({parentId: activity._id, order:order_of_activities})
      if(response > order_of_activities) order_of_activities = response
    }
    return order_of_activities
  }

  const max_order = await obtener_actividades_recursivas({parentId: id})
  return {activities: ordenar_objetos_por_order(complete_activities), max_order}
}

function ordenar_objetos_por_order(objetos) {
  // Función de comparación personalizada para ordenar los objetos
  function comparar_por_order(a, b) {
      // Itera sobre la longitud máxima de los arrays "order"
      for (let i = 0; i < Math.max(a.order.length, b.order.length); i++) {
          // Obtiene los dígitos de cada objeto, si no existen, asume 0
          const digitoA = a.order[i] || 0;
          const digitoB = b.order[i] || 0;

          // Compara los dígitos
          if (digitoA !== digitoB) {
              return digitoA - digitoB;
          }
      }

      // Si todos los dígitos son iguales, retorna 0 (no hay cambio en el orden)
      return 0;
  }

  // Ordena los objetos utilizando la función de comparación personalizada
  objetos.sort(comparar_por_order);

  return objetos;
}
