#!/usr/bin/env node

/**
 * Worker Process for Scheduled Social Media Posts
 * 
 * This script runs as a background process to handle scheduled posts.
 * It should be run separately from the Next.js server.
 * 
 * Usage:
 *   node scripts/worker.js
 * 
 * Or with PM2:
 *   pm2 start scripts/worker.js --name social-worker
 */

const { createPostWorker } = require('../src/lib/social/scheduler');

console.log('🚀 Starting social media post worker...');

const worker = createPostWorker();

console.log('✅ Worker is running and processing scheduled posts');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📦 Shutting down worker gracefully...');
  await worker.close();
  console.log('✅ Worker stopped');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📦 Shutting down worker gracefully...');
  await worker.close();
  console.log('✅ Worker stopped');
  process.exit(0);
});

// Keep process alive
process.stdin.resume();
