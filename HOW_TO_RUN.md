# How to Run Solarize Socials AI

This guide answers the question: **"How to run it?"**

## 🎯 Three Ways to Get Started

Choose the method that works best for you:

### Option 1: Quick Start (Recommended for Beginners) ⚡

Follow **[QUICKSTART.md](QUICKSTART.md)** - A 5-minute setup guide with:
- Clear prerequisites checklist
- Step-by-step instructions with exact commands
- Troubleshooting tips for common issues
- Links to free cloud services (no local install needed!)

```bash
# The essentials
git clone https://github.com/bajodoom/solarize-socials-ai.git
cd solarize-socials-ai
npm install
cp .env.example .env
# Edit .env with your API keys
npx prisma generate && npx prisma db push
npm run dev
```

### Option 2: Automated Setup (Uses Scripts) 🤖

Use our helper scripts for guided setup:

```bash
# Clone the repository
git clone https://github.com/bajodoom/solarize-socials-ai.git
cd solarize-socials-ai

# Check if you have everything needed
./scripts/check-requirements.sh

# Run automated setup
./scripts/setup.sh

# Start the app
npm run dev
```

The scripts will:
- ✅ Verify all prerequisites are installed
- ✅ Install dependencies
- ✅ Set up your .env file
- ✅ Initialize the database
- ✅ Give you clear next steps

### Option 3: Docker (Easiest Database Setup) 🐳

Use Docker to run PostgreSQL and Redis instantly:

```bash
git clone https://github.com/bajodoom/solarize-socials-ai.git
cd solarize-socials-ai

# Start databases with Docker
docker-compose up -d

# Install and setup
npm install
cp .env.example .env
# Edit .env (use docker-compose connection strings)
npx prisma generate && npx prisma db push
npm run dev
```

Docker connection strings for `.env`:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/solarize_socials"
REDIS_URL="redis://localhost:6379"
```

## 📋 What You Need

### Required
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL** - [Install locally](https://postgresql.org) or use [Supabase](https://supabase.com/) (free)
- **Redis** - [Install locally](https://redis.io) or use [Upstash](https://upstash.com/) (free)
- **OpenAI API Key** - [Get one](https://platform.openai.com/api-keys)

### Optional (for social media features)
- Twitter API credentials
- LinkedIn API credentials  
- Facebook/Instagram (Meta) API credentials

## 🚀 Running the App

Once set up, use these commands:

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Background worker (for scheduled posts)
node scripts/worker.js
```

Open your browser to **http://localhost:3000**

## 🆘 Having Issues?

### Quick Fixes

**Port already in use?**
```bash
npx kill-port 3000
```

**Database won't connect?**
```bash
# Check PostgreSQL is running
psql --version
# Or use cloud database (Supabase/Neon)
```

**Redis won't connect?**
```bash
redis-cli ping  # Should return PONG
# Or use cloud Redis (Upstash)
```

**More help:** Check the [Troubleshooting section in README.md](README.md#troubleshooting)

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
- **[README.md](README.md)** - Full documentation
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Detailed technical guide
- **[SUMMARY.md](SUMMARY.md)** - Feature overview

## ✅ Verify It's Working

1. **Landing Page**: Visit http://localhost:3000 - you should see the landing page
2. **Sign Up**: Click "Get Started" and create an account
3. **Dashboard**: After login, you should see the dashboard
4. **API Test**: Try generating content via the API

```bash
# Test AI generation (requires OpenAI key in .env)
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "AI in social media",
    "platform": "twitter",
    "tone": "professional",
    "variations": 3
  }'
```

## 🎉 Next Steps

Once running:

1. **Create an account** on the landing page
2. **Explore the dashboard** to see available features
3. **Connect social accounts** (optional - requires API keys)
4. **Generate content** with AI
5. **Schedule posts** for your social platforms

Need more help? Check the documentation or [create an issue](https://github.com/bajodoom/solarize-socials-ai/issues)!
