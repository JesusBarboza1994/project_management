export function setFormatExcel({workbook, activities}){
  const sheet_name = 'Lista de actividades'
  const worksheet = workbook.addWorksheet(sheet_name)
  const columns = ["Item", "Actividad", "Proyecto","Colaboradores", "Progreso", "Inicio", "Fin", "Duración (días)"]
  worksheet.addRow(columns);
  worksheet.getRow(1).font = {name: 'Arial', family:1, size: 11, bold: true}
  worksheet.getRow(1).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true}
  worksheet.getRow(1).fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'e3e8c8'}}
  worksheet.getRow(1).height = 40
  worksheet.columns.forEach((columna) => {
    columna.width = 50;
  });
  activities.forEach((activity) => {
    const row = [
      activity.order.join(".")+".",
      activity.title,
      activity.project,
      activity.users.map(user => user.username).join(", "),
      activity.has_subactivities ? "-" : `${activity.relative_progress*100}%`,
      activity.init_date,
      activity.end_date,
      activity.duration, 
    ];
    worksheet.addRow(row);
  });
}
