#!/bin/bash

echo "🧹 Cleaning Next.js cache and temp files..."

# Stop any running Next.js processes
pkill -f "next dev" 2>/dev/null || true

# Remove Next.js build cache
rm -rf .next

# Remove node_modules cache
rm -rf node_modules/.cache

# Remove any temporary files
rm -rf .next/static/development/*.tmp.*

echo "✅ Cache cleaned successfully!"
echo "🚀 Starting development server..."

npm run dev