import Activity from "../../../models/activity.model.js";

export async function deleteDescendantActivities(parentId) {
  let descendants = null;
  descendants = await Activity.find({ parent: parentId });
  if (!descendants || descendants.length === 0) {
    descendants = [];
  }

  const deletionPromises = [];

  if (descendants.length > 0) {
    for (const descendant of descendants) {
      // Elimina las subactividades de este descendiente
      deletionPromises.push(deleteDescendantActivities(descendant._id));
  
      // Luego, elimina el descendiente actual
      deletionPromises.push(Activity.findByIdAndDelete(descendant._id));
    }
  }

  // Espera a que todas las eliminaciones se completen antes de continuar
  await Promise.all(deletionPromises);

  console.log("eliminado");
}