# Usa Node.js 20 su Alpine Linux per leggerezza
FROM node:20-alpine

# Crea la directory di lavoro
WORKDIR /usr/src/app

# Copia i file di configurazione delle dipendenze
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice
COPY . .

# Espone la porta definita nelle specifiche (3001) 
EXPOSE 3001

# Avvia l'applicazione in modalità sviluppo (watch mode)
CMD ["npm", "run", "start:dev"]
