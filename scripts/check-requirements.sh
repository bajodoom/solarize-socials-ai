#!/bin/bash

# Solarize Socials AI - Requirements Checker
# This script verifies all prerequisites are met

echo "🔍 Checking Requirements for Solarize Socials AI"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

print_check() {
    if [ "$2" = "true" ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1"
    fi
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

ALL_GOOD=true

# Check Node.js
echo "📦 Node.js"
if command_exists node; then
    NODE_VERSION=$(node --version)
    MAJOR_VERSION=$(node --version | cut -d'.' -f1 | sed 's/v//')
    
    if [ "$MAJOR_VERSION" -ge 18 ]; then
        print_check "Node.js $NODE_VERSION (✓ version 18+)" "true"
    else
        print_check "Node.js $NODE_VERSION (✗ need version 18+)" "false"
        print_info "Install from: https://nodejs.org/"
        ALL_GOOD=false
    fi
else
    print_check "Node.js not installed" "false"
    print_info "Install from: https://nodejs.org/"
    ALL_GOOD=false
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_check "npm $NPM_VERSION" "true"
else
    print_check "npm not installed" "false"
    ALL_GOOD=false
fi

echo ""
echo "🗄️  Database (PostgreSQL)"
if command_exists psql; then
    PSQL_VERSION=$(psql --version | awk '{print $3}')
    print_check "PostgreSQL $PSQL_VERSION installed locally" "true"
else
    print_check "PostgreSQL not installed locally" "false"
    print_info "Options:"
    print_info "  1. Install locally: https://www.postgresql.org/download/"
    print_info "  2. Use cloud: https://supabase.com/ (free tier)"
    print_info "  3. Use cloud: https://neon.tech/ (free tier)"
fi

echo ""
echo "⚡ Cache (Redis)"
if command_exists redis-cli; then
    print_check "Redis installed locally" "true"
    
    if redis-cli ping >/dev/null 2>&1; then
        print_check "Redis server is running" "true"
    else
        print_check "Redis server is not running" "false"
        print_info "Start with: redis-server"
    fi
else
    print_check "Redis not installed locally" "false"
    print_info "Options:"
    print_info "  1. Install locally: https://redis.io/download"
    print_info "  2. Use cloud: https://upstash.com/ (free tier, recommended)"
fi

echo ""
echo "🔑 API Keys & Configuration"

if [ -f .env ]; then
    print_check ".env file exists" "true"
    
    # Check for placeholder values
    if grep -q "your-openai-api-key" .env 2>/dev/null; then
        print_check "OpenAI API key configured" "false"
        print_info "Get key from: https://platform.openai.com/api-keys"
    else
        print_check "OpenAI API key appears to be set" "true"
    fi
    
    if grep -q "your-secret-here" .env 2>/dev/null; then
        print_check "NEXTAUTH_SECRET configured" "false"
        print_info "Generate with: openssl rand -base64 32"
    else
        print_check "NEXTAUTH_SECRET appears to be set" "true"
    fi
    
    if grep -q "DATABASE_URL=" .env 2>/dev/null; then
        print_check "DATABASE_URL is set" "true"
    else
        print_check "DATABASE_URL not found" "false"
    fi
    
    if grep -q "REDIS_URL=" .env 2>/dev/null; then
        print_check "REDIS_URL is set" "true"
    else
        print_check "REDIS_URL not found" "false"
    fi
else
    print_check ".env file missing" "false"
    print_info "Run: cp .env.example .env"
    ALL_GOOD=false
fi

echo ""
echo "📚 Dependencies"
if [ -d node_modules ]; then
    print_check "node_modules exists" "true"
else
    print_check "node_modules missing" "false"
    print_info "Run: npm install"
    ALL_GOOD=false
fi

echo ""
echo "================================================"

if [ "$ALL_GOOD" = "true" ]; then
    echo -e "${GREEN}✓ All essential requirements met!${NC}"
    echo ""
    echo "Ready to run:"
    echo "  npm run dev"
else
    echo -e "${YELLOW}⚠ Some requirements need attention${NC}"
    echo ""
    echo "Follow the instructions above, then run this check again."
    echo ""
    echo "Quick setup:"
    echo "  ./scripts/setup.sh"
fi

echo ""
