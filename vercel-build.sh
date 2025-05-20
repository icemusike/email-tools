#!/bin/bash

# Navigate to the SpamScore directory
cd SpamScore

# Install dependencies
npm install

# Build the application
npm run build

# Copy built files to the deployment directory
cp -r dist/* ../public/ 