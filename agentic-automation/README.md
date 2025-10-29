# Agentic Automation

Agentic Automation is a Next.js orchestrator that listens to a Telegram bot keyword and executes a fully autonomous publishing workflow:

1. Collect fresh stories for the keyword from Google News RSS.
2. Generate a viral script package (hook, sections, CTA, social posts, title, description, tags, thumbnail prompt) with OpenAI Responses.
3. Produce narration using OpenAI TTS and design a thumbnail with OpenAI Images.
4. Render a ready-to-upload vertical MP4 using FFmpeg (bundled through `@ffmpeg-installer/ffmpeg`).
5. Upload the content directly to YouTube via the Data API and optionally broadcast to external social webhooks.
6. Notify the originating Telegram chat once publishing completes or fails.

The web dashboard ( `/` ) provides a live pulse of every job kicked off from Telegram, including status, headline, and the resulting YouTube link.

## Prerequisites

Set the following environment variables (see `.env.example`) before running locally or deploying to Vercel:

- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`
- `OPENAI_API_KEY`, optional `OPENAI_MODEL`
- `NEWS_API_KEY` *(optional, RSS is used by default)*
- `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN`, `YOUTUBE_CHANNEL_ID`
- Optional broadcast hook: `SOCIAL_WEBHOOK_URL`, `SOCIAL_WEBHOOK_TOKEN`

## Local Development

```bash
npm install
npm run dev
```

Expose `/api/telegram` to Telegram (e.g. via `ngrok`) and register it as the bot webhook, providing `TELEGRAM_WEBHOOK_SECRET` as the secret token so that the handler can validate incoming updates.

## Production Deployment

The project is optimized for Vercel’s Node runtime. FFmpeg is bundled via `@ffmpeg-installer/ffmpeg`, so no extra build steps are required. Ensure the environment variables above are configured in Vercel before deploying.
