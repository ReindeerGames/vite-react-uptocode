#!/bin/bash

# UptoCode Website Deployment Script
# This script builds and pushes the Docker image to your registry

set -e

echo "🚀 Starting deployment process..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
REGISTRY="reg.shtf.co.za"
IMAGE_NAME="uptocode-website"
TAG="latest"
FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${TAG}"

# Check if .env exists, create dummy if not (env vars will be set in Portainer)
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No .env file found, creating dummy file for build...${NC}"
    echo "# Env variables will be set in Portainer" > .env
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Build the React app
echo -e "${YELLOW}🔨 Building React application...${NC}"
npm run build

# Build Docker image
echo -e "${YELLOW}🐳 Building Docker image...${NC}"
docker build -t ${IMAGE_NAME} .

# Tag the image
echo -e "${YELLOW}🏷️  Tagging image...${NC}"
docker tag ${IMAGE_NAME} ${FULL_IMAGE}

# Login to registry
echo -e "${YELLOW}🔐 Logging into Docker registry...${NC}"
docker login ${REGISTRY}

# Push to registry
echo -e "${YELLOW}📤 Pushing image to registry...${NC}"
docker push ${FULL_IMAGE}

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""
echo "Image pushed to: ${FULL_IMAGE}"
echo ""
echo "To deploy on your Docker host, run:"
echo ""
echo "  docker pull ${FULL_IMAGE}"
echo "  docker stop uptocode-website 2>/dev/null || true"
echo "  docker rm uptocode-website 2>/dev/null || true"
echo "  docker run -d --name uptocode-website --restart unless-stopped -p 3000:3000 --env-file .env ${FULL_IMAGE}"
echo ""
