# Usa un'immagine con Maven e JDK già pronti
FROM maven:3.9.6-eclipse-temurin-21-jammy

# Cartella di lavoro nel container
WORKDIR /app

# Copiamo il pom.xml per scaricare le dipendenze (ottimizza la cache)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamo il codice sorgente
COPY src ./src

# Comando per avviare Spring Boot direttamente dal codice
# Questo evita il problema del jarfile mancante
CMD ["mvn", "spring-boot:run"]
