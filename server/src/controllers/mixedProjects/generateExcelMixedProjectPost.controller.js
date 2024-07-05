import { generateExcelMixedProject } from "../../services/mixedProject/generateExcelMixedProject.service.js";

export default async function generateExcelMixedProjectPostController(req, res){
  const { id } = req.params
  const { search="", order, date="", relative_progress=0} = req.body
  try {
    const { filename, workbook } = await generateExcelMixedProject({id, search, order, date, relative_progress, workbook})
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  
    workbook.xlsx.write(res)
      .then(() => {
        res.end();
        console.log('Archivo Excel enviado exitosamente.');
      })
      .catch((error) => {
        console.error('Error al enviar el archivo Excel:', error);
        res.status(500).send(error);
      });
    
  } catch (error) {
    console.log("ERROR",error)
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })
  }
}
