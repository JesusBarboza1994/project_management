export function formatStringToDate(string){
  if(string.includes("T")) return new Date(string)
  const [año, mes, dia] = string.split('-').map(Number); // Divide la cadena y convierte a números
  // Nota: Restamos 1 al mes ya que los meses en JavaScript se indexan desde 0 (enero) a 11 (diciembre)
  return new Date(año, mes - 1, dia);
}