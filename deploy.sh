#!/bin/bash

# Watchtower Frontend Deployment Script
# Run this script on your Debian server

set -e

echo "🚀 Deploying Watchtower Frontend..."

# Configuration
APP_DIR="/opt/watchtower-fe"
REPO_URL="https://github.com/souhaibtouati/watchtower-fe.git"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker not found. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}Docker installed successfully${NC}"
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}Docker Compose not found. Installing...${NC}"
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
    echo -e "${GREEN}Docker Compose installed successfully${NC}"
fi

# Create app directory
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

echo -e "${GREEN}✓ Prerequisites installed${NC}"
echo ""

# Check if we should clone the repo
if [ ! -d "$APP_DIR/.git" ]; then
    echo -e "${YELLOW}Cloning repository...${NC}"
    sudo rm -rf $APP_DIR
    sudo git clone $REPO_URL $APP_DIR
    sudo chown -R $USER:$USER $APP_DIR
    cd $APP_DIR
    echo -e "${GREEN}✓ Repository cloned${NC}"
else
    echo -e "${YELLOW}Updating repository...${NC}"
    cd $APP_DIR
    git pull
    echo -e "${GREEN}✓ Repository updated${NC}"
fi

# Check if Node.js is installed (needed for building)
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Installing...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo -e "${GREEN}✓ Node.js installed${NC}"
fi

# Install dependencies and build
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}Building application...${NC}"
npm run build

# Build and start Docker container
echo -e "${YELLOW}Starting Docker container...${NC}"
docker compose up -d --build

echo ""
echo -e "${GREEN}✓ Deployment complete!${NC}"
echo -e "${GREEN}The app is now available at http://$(hostname -I | awk '{print $1}'):3000${NC}"
