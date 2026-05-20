# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend (Quarkus)
FROM maven:3.9.6-eclipse-temurin-21 AS backend-build
WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:go-offline
COPY src ./src
# Copy the built frontend into Quarkus resources
COPY --from=frontend-build /frontend/dist ./src/main/resources/META-INF/resources
RUN mvn package -DskipTests

# Stage 3: Final Image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/target/quarkus-app/ ./
EXPOSE 8080

# Environment variables (can be overridden at runtime)
ENV QUARKUS_REDIS_HOSTS=redis://redis:6379
ENV QUARKUS_HTTP_HOST=0.0.0.0

CMD ["java", "-jar", "quarkus-run.jar"]
