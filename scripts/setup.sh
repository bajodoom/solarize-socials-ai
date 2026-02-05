#!/bin/bash

# Solarize Socials AI - Setup Script
# This script helps you set up the application quickly

set -e  # Exit on error

echo "🚀 Solarize Socials AI - Setup Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Print colored message
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo "Step 1: Checking prerequisites..."
echo ""

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
    
    # Check if version is 18+
    MAJOR_VERSION=$(node --version | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. You have version $NODE_VERSION"
        exit 1
    fi
else
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: $NPM_VERSION"
else
    print_error "npm is not installed"
    exit 1
fi

# Check PostgreSQL
if command_exists psql; then
    PSQL_VERSION=$(psql --version)
    print_success "PostgreSQL is installed: $PSQL_VERSION"
else
    print_warning "PostgreSQL not found locally. You can use a cloud database (Supabase, Neon)"
fi

# Check Redis
if command_exists redis-cli; then
    print_success "Redis CLI is installed"
    
    # Check if Redis is running
    if redis-cli ping >/dev/null 2>&1; then
        print_success "Redis server is running"
    else
        print_warning "Redis is installed but not running. Start it with: redis-server"
    fi
else
    print_warning "Redis not found locally. You can use Upstash (cloud Redis)"
fi

echo ""
echo "Step 2: Installing dependencies..."
npm install

echo ""
echo "Step 3: Setting up environment file..."

if [ -f .env ]; then
    print_warning ".env file already exists. Skipping..."
else
    cp .env.example .env
    print_success "Created .env file from .env.example"
    echo ""
    print_warning "⚠️  IMPORTANT: Edit .env file with your actual credentials!"
    echo ""
    echo "Required variables:"
    echo "  - DATABASE_URL (PostgreSQL connection string)"
    echo "  - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
    echo "  - OPENAI_API_KEY (get from https://platform.openai.com/api-keys)"
    echo "  - REDIS_URL (Redis connection string)"
    echo ""
fi

echo "Step 4: Checking if .env is configured..."

if [ -f .env ]; then
    # Check if critical variables are set (not just placeholders)
    if grep -q "your-openai-api-key" .env 2>/dev/null; then
        print_warning "OpenAI API key not configured yet"
        NEEDS_CONFIG=true
    fi
    
    if grep -q "your-secret-here" .env 2>/dev/null; then
        print_warning "NEXTAUTH_SECRET not configured yet"
        NEEDS_CONFIG=true
    fi
    
    if [ "$NEEDS_CONFIG" = true ]; then
        echo ""
        print_warning "Please edit .env file before continuing:"
        echo "  nano .env  # or use your preferred editor"
        echo ""
        read -p "Have you configured .env? (y/n) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            print_error "Setup incomplete. Please configure .env and run this script again."
            exit 1
        fi
    fi
fi

echo ""
echo "Step 5: Setting up database..."

# Generate Prisma client
npx prisma generate

# Push database schema
if npx prisma db push; then
    print_success "Database schema created successfully"
else
    print_error "Failed to create database schema. Check your DATABASE_URL in .env"
    exit 1
fi

echo ""
echo "======================================"
print_success "Setup complete! 🎉"
echo "======================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Open your browser to:"
echo "   http://localhost:3000"
echo ""
echo "3. (Optional) Start the background worker for scheduled posts:"
echo "   node scripts/worker.js"
echo ""
echo "For more information, see:"
echo "  - QUICKSTART.md"
echo "  - README.md"
echo "  - IMPLEMENTATION_GUIDE.md"
echo ""
