FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Porta standard per Next.js
EXPOSE 3000

# Avvia Next.js in modalità sviluppo
CMD ["npm", "run", "dev"]
