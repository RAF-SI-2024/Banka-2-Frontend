#!/bin/bash

IMAGE_NAME="frontend_banka_2"

echo "Starting $IMAGE_NAME image and its dependencies..."

# Ask user for the APP_ENV to use
echo "Please select the environment (development/production):"
select APP_ENV in "build-dev" "build-prod"; do
  case $APP_ENV in
    build-dev)
      echo "You selected development environment."
      break
      ;;
    build-prod)
      echo "You selected production environment."
      break
      ;;
    *)
      echo "Invalid selection. Please select 1 for development or 2 for production."
      ;;
  esac
done

# Build the Docker container with the selected APP_ENV as a build argument
docker build --build-arg APP_ENV=$APP_ENV -t $IMAGE_NAME .

if [ "$(docker ps -aq -f name=$IMAGE_NAME)" ]; then
    echo "Container $IMAGE_NAME already exists. Removing it..."
    docker rm -f $IMAGE_NAME
fi

# Run the Docker container with the selected APP_ENV as an environment variable
docker run --name $IMAGE_NAME -p 5173:80 -e APP_ENV=build-prod $IMAGE_NAME
