#!/bin/bash

# Build validation script
# Checks for syntax errors and validates the build

set -e

echo "🔍 Validating build configuration..."

# Check Node.js configuration files for syntax errors
echo "  ✓ Checking next.config.mjs..."
node -c next.config.mjs

echo "  ✓ Checking eslint.config.mjs..."
node -c eslint.config.mjs

echo "  ✓ Checking postcss.config.mjs..."
node -c postcss.config.mjs

# Check TypeScript compilation
echo "  ✓ Running TypeScript check..."
npx tsc --noEmit

# Run the build
echo "  ✓ Running Next.js build..."
npm run build

echo "✅ Build validation complete! All checks passed."
