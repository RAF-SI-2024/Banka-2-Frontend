@echo off
SET IMAGE_NAME=frontend_banka_2

echo Starting %IMAGE_NAME% image and its dependencies...

:: Ask user for the APP_ENV to use
echo Please select the environment (development/production):
echo 1. development
echo 2. production

set /p APP_ENV_CHOICE=Please enter 1 for development or 2 for production:

:: Set APP_ENV based on user input
if "%APP_ENV_CHOICE%"=="1" (
    set APP_ENV=build-dev
    echo You selected development environment.
) else if "%APP_ENV_CHOICE%"=="2" (
    set APP_ENV=build-prod
    echo You selected production environment.
) else (
    echo Invalid selection. Please select 1 for development or 2 for production.
    exit /b
)

:: Build the Docker container with the selected APP_ENV as a build argument
docker build --build-arg APP_ENV=%APP_ENV% -t %IMAGE_NAME% .

echo Checking if container %IMAGE_NAME% exists...
docker ps -a | findstr "%IMAGE_NAME%" > nul
if %ERRORLEVEL% EQU 0 (
    echo Container %IMAGE_NAME% exists. Removing it...
    docker rm -f %IMAGE_NAME%
)


:: Run the Docker container with the selected APP_ENV as an environment
echo Starting new container %IMAGE_NAME%...
docker run --name %IMAGE_NAME% -p 5173:80 -e APP_ENV=build-prod %IMAGE_NAME%

echo Press any key to continue...
pause >nul
exit /b 0
