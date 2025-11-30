@echo off
echo ==========================================
echo PC Part Picker - Production Redeploy Script
echo ==========================================

echo [1/3] Stopping existing containers...
docker-compose down

echo [2/3] Rebuilding images (this may take a while)...
docker-compose build

echo [3/3] Starting containers in detached mode...
docker-compose up -d

echo ==========================================
echo Deployment complete!
echo App is running at: http://localhost:3000
echo ==========================================
pause
