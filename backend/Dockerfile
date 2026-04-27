# Utilizziamo un'immagine che include sia Maven che JDK 25
# Eclipse Temurin è lo standard attuale per le immagini Java
FROM maven:3.9-eclipse-temurin-25

WORKDIR /app

# Copiamo i file necessari per la risoluzione delle dipendenze
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
EXPOSE 8080