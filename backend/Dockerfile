# Elegir la base ---
FROM node:18-alpine
WORKDIR /app
# Instalar las dependencias ---
COPY package*.json ./
RUN npm install
#  Copiar nuestro código ---
COPY . .
# Abrir la puerta ---
EXPOSE 3000
# El comando de arranque ---
CMD ["node", "index.js"]