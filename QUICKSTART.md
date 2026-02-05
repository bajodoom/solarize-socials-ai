# 🚀 Quick Start Guide

Get Solarize Socials AI running in 5 minutes!

## Prerequisites Check

Before you start, make sure you have:

- ✅ **Node.js 18+** - [Download here](https://nodejs.org/)
- ✅ **PostgreSQL** - [Download here](https://www.postgresql.org/download/) or use [Supabase](https://supabase.com/) (free)
- ✅ **Redis** - [Download here](https://redis.io/download) or use [Upstash](https://upstash.com/) (free)
- ✅ **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)

### 🐳 Docker Option (Easiest!)

**Don't want to install PostgreSQL and Redis manually?** Use Docker!

```bash
# Start PostgreSQL and Redis with Docker
docker-compose up -d

# Use these in your .env:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/solarize_socials"
# REDIS_URL="redis://localhost:6379"
```

### Manual Setup

**Quick Check**: Run these commands to verify:
```bash
node --version  # Should be 18.0.0 or higher
psql --version  # Should show PostgreSQL version
redis-cli ping  # Should return "PONG"
```

## Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/bajodoom/solarize-socials-ai.git
cd solarize-socials-ai

# Install dependencies
npm install
```

## Step 2: Set Up Environment (1 minute)

```bash
# Copy the example environment file
cp .env.example .env
```

Now edit `.env` with your actual values:

```bash
# REQUIRED - Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/solarize_socials"

# REQUIRED - NextAuth Secret (generate one with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# REQUIRED - OpenAI API Key
OPENAI_API_KEY="sk-your-actual-openai-key"

# REQUIRED - Redis
REDIS_URL="redis://localhost:6379"

# OPTIONAL - Social Media APIs (for publishing features)
# TWITTER_API_KEY="your-key"
# TWITTER_API_SECRET="your-secret"
# LINKEDIN_CLIENT_ID="your-id"
# LINKEDIN_CLIENT_SECRET="your-secret"
# META_APP_ID="your-id"
# META_APP_SECRET="your-secret"
```

### 🔑 Quick Tips:

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Don't have PostgreSQL locally?** Use free cloud options:
- [Supabase](https://supabase.com/) - Get DATABASE_URL instantly
- [Neon](https://neon.tech/) - Serverless PostgreSQL

**Don't have Redis locally?** Use free cloud options:
- [Upstash](https://upstash.com/) - Get REDIS_URL instantly (recommended for serverless)

## Step 3: Set Up Database (1 minute)

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push
```

## Step 4: Run the App! (30 seconds)

```bash
# Start the development server
npm run dev
```

🎉 **That's it!** Open your browser to:
👉 **http://localhost:3000**

## Step 5: Test It Out

1. **Create an account**: Click "Get Started" on the landing page
2. **Sign up**: Use any email and password
3. **Access dashboard**: You'll be redirected to the dashboard
4. **Try AI generation**: Use the API or dashboard to generate content

## Running the Background Worker (Optional)

For scheduled posts to work, run the worker in a separate terminal:

```bash
# In a new terminal window
node scripts/worker.js
```

## 🐛 Troubleshooting

### Port 3000 already in use?
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or run on a different port
PORT=3001 npm run dev
```

### Database connection error?
```bash
# Make sure PostgreSQL is running
sudo service postgresql start  # Linux
brew services start postgresql # macOS

# Test your connection string
psql "postgresql://postgres:password@localhost:5432/solarize_socials"
```

### Redis connection error?
```bash
# Make sure Redis is running
redis-cli ping  # Should return PONG

# Start Redis if not running
redis-server  # Keep this terminal open
```

### Prisma errors?
```bash
# Reset Prisma client
rm -rf node_modules/.prisma
npx prisma generate
```

### OpenAI API errors?
- Check your API key is correct in `.env`
- Verify you have credits: https://platform.openai.com/account/usage
- Make sure billing is set up: https://platform.openai.com/account/billing

## 📚 Next Steps

Once you have the app running:

1. **Explore the API**: See [API Documentation](README.md#api-documentation)
2. **Connect social accounts**: Configure social media API keys in `.env`
3. **Deploy to production**: See [Deployment Guide](IMPLEMENTATION_GUIDE.md#deployment)
4. **Read full docs**: Check out [README.md](README.md) and [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)

## 🆘 Still Having Issues?

1. Check the [detailed setup instructions](IMPLEMENTATION_GUIDE.md)
2. Review [common issues](#troubleshooting) above
3. Make sure all environment variables are set correctly
4. Check the logs in your terminal for specific error messages

## Quick Reference Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server

# Database
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma studio    # Open database GUI

# Worker (for scheduled posts)
node scripts/worker.js  # Run background job processor
```

---

**Welcome to Solarize Socials AI!** 🎉 Now you're ready to automate your social media with AI.
