# Solarize Socials AI

An AI-powered social media automation platform that generates content with A/B testing variations, creates AI images, integrates trending topics, and provides a visual content calendar for scheduling posts across multiple social platforms.

## 🚀 Quick Start

**Want to get started immediately?** See **[QUICKSTART.md](QUICKSTART.md)** for a 5-minute setup guide!

```bash
# Quick setup (requires Node.js 18+, PostgreSQL, Redis, OpenAI API key)
git clone https://github.com/bajodoom/solarize-socials-ai.git
cd solarize-socials-ai
npm install
cp .env.example .env
# Edit .env with your credentials
npx prisma generate && npx prisma db push
npm run dev
# Visit http://localhost:3000
```

**Need help?** Check:
- 📋 **[QUICKSTART.md](QUICKSTART.md)** - Beginner-friendly setup guide
- 📖 **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Detailed documentation
- 🐛 [Troubleshooting](#troubleshooting) - Common issues and solutions

---

## Features

### 🤖 AI-Powered Content Generation
- Generate engaging social media posts using GPT-4o
- Create 3 content variations per request for A/B testing
- Platform-specific optimization (Twitter, LinkedIn, Facebook, Instagram)
- Tone customization (professional, casual, funny, inspiring)
- Automatic hashtag extraction and suggestions

### 🎨 AI Image Generation
- DALL-E 3 integration for stunning visuals
- 1024x1024 high-quality images
- Style customization options
- Automatic prompt enhancement

### 📈 Trend Integration
- Fetch trending topics automatically
- Incorporate relevant trends into content
- 24-hour caching for performance
- Support for multiple platforms

### 📅 Smart Scheduling
- Visual content calendar with FullCalendar
- Drag-and-drop scheduling
- BullMQ + Redis for reliable job processing
- Retry logic with exponential backoff
- Support for immediate and scheduled publishing

### 🌐 Multi-Platform Publishing
- Twitter (X) integration
- LinkedIn professional posts
- Facebook page publishing
- Instagram business accounts
- Unified API for all platforms
- Platform-specific formatting

### 📊 Analytics & Tracking
- Track post performance
- Monitor likes, shares, comments
- Impressions and click tracking
- Per-platform analytics

## Tech Stack

- **Frontend & Backend**: Next.js 14 with App Router, TypeScript
- **UI**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI API (GPT-4o, DALL-E 3)
- **Queue System**: BullMQ + Redis
- **Social APIs**: Twitter API v2, LinkedIn API, Meta Graph API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Redis server
- OpenAI API key
- Social media API credentials (optional for full functionality)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bajodoom/solarize-socials-ai.git
cd solarize-socials-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/solarize_socials"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OpenAI (required for AI features)
OPENAI_API_KEY="sk-your-openai-api-key"

# Redis (required for scheduling)
REDIS_URL="redis://localhost:6379"

# Social Media APIs (optional)
TWITTER_API_KEY="your-twitter-api-key"
TWITTER_API_SECRET="your-twitter-api-secret"
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
META_APP_ID="your-meta-app-id"
META_APP_SECRET="your-meta-app-secret"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
solarize-socials-ai/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── ai/            # AI generation endpoints
│   │   │   ├── post/          # Post management
│   │   │   ├── trends/        # Trending topics
│   │   │   └── social/        # Social account connections
│   │   ├── (auth)/            # Auth pages
│   │   └── (dashboard)/       # Dashboard pages
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── calendar/          # Calendar components
│   │   ├── content/           # Content editor & variations
│   │   └── dashboard/         # Dashboard components
│   └── lib/
│       ├── ai/                # AI integration logic
│       ├── social/            # Social media APIs
│       ├── auth.ts            # NextAuth config
│       ├── db.ts              # Prisma client
│       └── utils.ts           # Utility functions
├── .env.example               # Environment template
└── package.json
```

## API Documentation

### Content Generation
**POST** `/api/ai/generate`
```json
{
  "topic": "AI and social media",
  "platform": "twitter",
  "tone": "professional",
  "includeTrends": true,
  "variations": 3
}
```

### Image Generation
**POST** `/api/ai/image`
```json
{
  "prompt": "A futuristic social media dashboard",
  "style": "modern and professional"
}
```

### Fetch Trends
**GET** `/api/trends?platform=twitter`

### Create Post
**POST** `/api/post/create`
```json
{
  "content": "Your post content",
  "platforms": ["twitter", "linkedin"],
  "imageUrl": "https://...",
  "variations": [...]
}
```

### Schedule Post
**POST** `/api/post/schedule`
```json
{
  "postId": "post-id",
  "scheduledTime": "2024-12-25T10:00:00Z",
  "platforms": ["twitter", "linkedin"]
}
```

### Publish Immediately
**POST** `/api/post/publish`
```json
{
  "postId": "post-id",
  "platforms": ["twitter", "linkedin"]
}
```

## Database Schema

The application uses Prisma with the following main models:

- **User**: User accounts with authentication
- **SocialAccount**: Connected social media accounts
- **Post**: Content with variations, scheduling, and metadata
- **Template**: Reusable content templates
- **Analytics**: Post performance metrics
- **Trend**: Cached trending topics

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

### Database Setup

Use a PostgreSQL provider like:
- [Supabase](https://supabase.com/)
- [Neon](https://neon.tech/)
- [Railway](https://railway.app/)

### Redis Setup

Use a Redis provider like:
- [Upstash](https://upstash.com/) (recommended for serverless)
- [Redis Cloud](https://redis.com/try-free/)

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

### Database Migrations
```bash
npx prisma migrate dev
npx prisma studio  # Open Prisma Studio
```

## Security Considerations

- All API keys are stored in environment variables
- NextAuth.js handles authentication securely
- Social media tokens are encrypted in the database
- API routes are protected with authentication middleware
- Rate limiting implemented on API endpoints

## Troubleshooting

### Common Issues

#### "Port 3000 is already in use"
```bash
# Kill the process using port 3000
npx kill-port 3000
# Or run on a different port
PORT=3001 npm run dev
```

#### "Cannot connect to database"
1. Verify PostgreSQL is running: `psql --version`
2. Check your DATABASE_URL in `.env`
3. Test connection: `psql "your-database-url-here"`
4. For cloud databases (Supabase/Neon), verify connection string format

#### "Redis connection refused"
1. Check if Redis is running: `redis-cli ping` (should return "PONG")
2. Start Redis: `redis-server`
3. Or use cloud Redis: [Upstash](https://upstash.com/) (free tier)

#### "OpenAI API errors"
1. Verify your API key in `.env` is correct
2. Check you have credits: https://platform.openai.com/account/usage
3. Ensure billing is set up: https://platform.openai.com/account/billing

#### "Prisma Client errors"
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset and recreate database
npx prisma db push --force-reset
```

#### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Need More Help?

1. 📋 Check [QUICKSTART.md](QUICKSTART.md) for step-by-step setup
2. 📖 See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for detailed docs
3. 🐛 [Create an issue](https://github.com/bajodoom/solarize-socials-ai/issues) on GitHub

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/bajodoom/solarize-socials-ai/issues)
- Documentation: Check this README and code comments

## Roadmap

- [ ] Advanced analytics dashboard
- [ ] Post performance predictions
- [ ] Team collaboration features
- [ ] Custom AI model fine-tuning
- [ ] More social platform integrations
- [ ] Mobile app

---

Built with ❤️ using Next.js, TypeScript, and OpenAI
# solarize-socials-ai
Social network automation system

Core Features Included:
✅ AI Content Generation with 3 variations for A/B testing
✅ DALL-E 3 Image Generation for visual content
✅ Trend Integration - Auto-fetch trending topics/hashtags
✅ Content Calendar - Visual scheduling with FullCalendar
✅ Multi-Platform Support - Twitter, LinkedIn, Facebook, Instagram
✅ Automated Scheduling - BullMQ + Redis queue system
✅ Platform Previews - See how posts look before publishing
✅ Analytics Tracking - Monitor post performance

Tech Stack:
Next.js 14 (App Router) + TypeScript
Prisma + PostgreSQL
OpenAI API (GPT-4o + DALL-E 3)
shadcn/ui + Tailwind CSS
NextAuth.js for authentication
BullMQ for job scheduling
Social Media APIs integrated
Project Structure:
Complete folder structure with organized components, API routes, database schemas, and reusable libraries for AI generation, social posting, and scheduling.
