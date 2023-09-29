# Utiliza una imagen de Node.js como punto de partida
FROM node:18

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el package.json y package-lock.json del servidor
COPY server/package*.json ./

# Instala las dependencias del servidor
RUN npm install

# Copia el resto de los archivos del servidor
COPY server/ .

# Define el comando para iniciar la aplicación
CMD ["npm", "start"]
