#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Copy all files from out directory to repository root
echo "Copying built files to repository root..."
cp -r out/* ./

# Add all files to git
echo "Adding files to git..."
git add .

# Commit the changes
echo "Committing changes..."
git commit -m "Deploy static files for GitHub Pages"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo "Deployment complete!"
