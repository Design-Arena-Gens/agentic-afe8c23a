import { NextResponse } from 'next/server';
import { listJobs } from '@/lib/jobs-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const jobs = await listJobs();
  return NextResponse.json({ jobs });
}
