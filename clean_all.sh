#!/bin/bash

# Clean frontend build artifacts
rm -rf src/frontend/build
rm -rf src/frontend/dist
rm -rf src/frontend/node_modules

# Clean backend static and Python cache
rm -rf src/backend/base/langflow/frontend
rm -rf .venv
rm -rf venv
rm -rf dist
rm -rf build
rm -rf __pycache__
find . -name "__pycache__" -type d -exec rm -rf {} +
find . -name "*.pyc" -delete

# Clean Docker build cache
docker builder prune -af -f

# Clean npm cache
npm cache clean --force

echo "All clean! 🚀"