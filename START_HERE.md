# 👋 Start Here - How to Run Solarize Socials AI

**New to this project?** This is your starting point!

## 📖 Where to Begin

Depending on what you need:

### 🚀 Want to Run the App RIGHT NOW?
→ **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide

### 🤔 Just Want to Know "How to Run It?"
→ **[HOW_TO_RUN.md](HOW_TO_RUN.md)** - Direct answer with 3 methods

### 📚 Need Full Documentation?
→ **[README.md](README.md)** - Complete project documentation

### 🔧 Want Detailed Technical Info?
→ **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - In-depth guide

### 📊 Just Browsing Features?
→ **[SUMMARY.md](SUMMARY.md)** - Feature overview

## ⚡ Super Quick Start (TL;DR)

Got Node.js 18+, PostgreSQL, Redis, and OpenAI API key? Run:

```bash
git clone https://github.com/bajodoom/solarize-socials-ai.git
cd solarize-socials-ai
npm install
cp .env.example .env
# Edit .env with your keys
npx prisma generate && npx prisma db push
npm run dev
```

Visit: http://localhost:3000

## 🛠️ Automated Setup

Want help? Use our scripts:

```bash
./scripts/check-requirements.sh  # Check what you need
./scripts/setup.sh               # Automated setup
```

## 🐳 Easiest Database Setup

Use Docker for PostgreSQL + Redis:

```bash
docker-compose up -d
```

## 📞 Need Help?

1. Check [Troubleshooting in README.md](README.md#troubleshooting)
2. See [QUICKSTART.md](QUICKSTART.md) for step-by-step help
3. [Create an issue](https://github.com/bajodoom/solarize-socials-ai/issues)

---

**Ready?** Head to **[QUICKSTART.md](QUICKSTART.md)** to get started! 🚀
