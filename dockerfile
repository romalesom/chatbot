# Verwende ein Basis-Image, das Node.js enthält
FROM node:18-alpine

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die package.json und package-lock.json Dateien
COPY package*.json ./

# Kopiere die .notification.localstore.json und .notification.testtoolstore.json Dateien
COPY .notification*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Installiere ts-node global
RUN npm install -g tsx

# Kopiere den Rest des Projekts in das Arbeitsverzeichnis
COPY . .

# Exponiere den Port, auf dem der Bot laufen wird
EXPOSE 3978

# Starte den Bot
CMD ["npm", "start"]