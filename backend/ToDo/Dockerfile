# Use an official Java runtime as a parent image
FROM openjdk:17-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file from the host into the container at /app
COPY target/ToDo-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080 for the application
EXPOSE 8080

# Run the JAR file when the container starts
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=docker"]
