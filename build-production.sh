#!/bin/bash

echo "Building CivicPro for production deployment..."

# Install dependencies
npm install

# Build the client
echo "Building client..."
npm run build

# Create deployment directory
mkdir -p dist/deployment

# Copy server files
echo "Copying server files..."
cp -r server dist/deployment/
cp -r shared dist/deployment/
cp package.json dist/deployment/
cp package-lock.json dist/deployment/

# Copy built client to server's public directory
echo "Copying built client..."
mkdir -p dist/deployment/public
cp -r dist/* dist/deployment/public/

echo "Production build complete! Files are in dist/deployment/"