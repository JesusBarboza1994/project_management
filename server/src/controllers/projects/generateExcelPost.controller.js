import { generateExcel } from '../../services/project/generateExcel.service.js'
export default async function generateExcelPostController(req, res) {
  const { id } = req.params
  const { search="", order, date="", relative_progress=0} = req.body
  
  const { workbook, filename } = await generateExcel({id, search, order, date, relative_progress })
  
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
  
}
