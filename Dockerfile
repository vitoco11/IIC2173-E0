FROM node:22

WORKDIR /usr/src/app

# copiamos los archivos e instalamos las dependencias
COPY package*.json ./
RUN npm install

COPY . .