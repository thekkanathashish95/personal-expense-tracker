#!/bin/bash
cd "$(dirname "$0")"
echo "Starting Vite development server..."
echo "Project directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Vite version: $(npx vite --version)"
echo ""
echo "Starting server on http://localhost:5173"
echo "Press Ctrl+C to stop"
echo ""
npx vite --host --port 5173 --open
