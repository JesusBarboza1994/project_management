function esTextoNoNumerico(texto) {
  return isNaN(parseFloat(texto)) || !isFinite(texto);
}

module.exports = {
  esTextoNoNumerico
}