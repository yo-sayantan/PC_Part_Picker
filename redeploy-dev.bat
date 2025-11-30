@echo off
echo ==========================================
echo PC Part Picker - Development Redeploy Script
echo ==========================================

echo [1/3] Stopping existing dev containers...
docker-compose -f docker-compose.dev.yml down

echo [2/3] Rebuilding dev images...
docker-compose -f docker-compose.dev.yml build

echo [3/3] Starting dev containers...
echo Press Ctrl+C to stop the server
docker-compose -f docker-compose.dev.yml up
