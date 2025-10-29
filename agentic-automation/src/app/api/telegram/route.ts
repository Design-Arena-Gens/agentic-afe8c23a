import { NextRequest, NextResponse } from 'next/server';
import { queueJob, runJob } from '@/lib/pipeline';
import { extractKeyword, verifyTelegramSecret, type TelegramUpdate } from '@/lib/telegram';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-telegram-bot-api-secret-token');
  if (!verifyTelegramSecret(secret)) {
    return NextResponse.json({ ok: false, error: 'Invalid webhook secret' }, { status: 401 });
  }

  const payload = (await req.json().catch(() => ({}))) as TelegramUpdate;
  const message = payload.message;
  if (!message?.text) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const keyword = extractKeyword(message.text);
  if (!keyword) {
    return NextResponse.json({ ok: true, ignored: true, reason: 'no_keyword' });
  }

  const job = await queueJob(keyword);

  setImmediate(() => {
    runJob(job, message.chat.id).catch((error) => {
      console.error('Pipeline failed', error);
    });
  });

  return NextResponse.json({ ok: true, jobId: job.id });
}
