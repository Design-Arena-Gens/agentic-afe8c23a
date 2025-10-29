'use client';

import { useEffect, useMemo, useState } from 'react';
import type { JobRecord } from '@/lib/jobs-store';

interface JobDashboardProps {
  initialJobs: JobRecord[];
}

export function JobDashboard({ initialJobs }: JobDashboardProps) {
  const [jobs, setJobs] = useState(initialJobs);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/jobs');
        if (!response.ok) return;
        const data = (await response.json()) as { jobs: JobRecord[] };
        setJobs(data.jobs);
      } catch {
        // Ignore polling errors.
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const rows = useMemo(() => jobs.slice(0, 20), [jobs]);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/jobs');
      const data = (await response.json()) as { jobs: JobRecord[] };
      setJobs(data.jobs);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <header className="flex flex-col gap-3 border-b border-zinc-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
              Agentic Video Automations
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-white">
              Telegram Keyword Launchpad
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Type a keyword in Telegram. This dashboard mirrors every fully automated job as it researches, writes, produces, and publishes your viral-ready videos.
            </p>
          </div>
          <button
            onClick={refresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-5 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRefreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </header>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-2xl">
          <div className="grid grid-cols-12 border-b border-zinc-800 px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
            <p className="col-span-3">Keyword</p>
            <p className="col-span-2">Status</p>
            <p className="col-span-3">Headline</p>
            <p className="col-span-2">Created</p>
            <p className="col-span-2">Result</p>
          </div>
          <div>
            {rows.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-zinc-500">
                Awaiting your first Telegram trigger…
              </div>
            ) : (
              rows.map((job) => (
                <article
                  key={job.id}
                  className="grid grid-cols-12 items-center border-b border-zinc-800/60 px-6 py-4 text-sm last:border-b-0"
                >
                  <div className="col-span-3 font-medium text-zinc-100">
                    {job.keyword}
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(job.status)}`}>
                      {statusLabel(job.status)}
                    </span>
                  </div>
                  <div className="col-span-3 text-zinc-300">
                    {job.headline ?? '—'}
                  </div>
                  <div className="col-span-2 text-xs text-zinc-500">
                    {formatDate(job.createdAt)}
                  </div>
                  <div className="col-span-2 text-xs">
                    {job.youtubeUrl ? (
                      <a
                        href={job.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 underline-offset-2 hover:underline"
                      >
                        Watch
                      </a>
                    ) : job.error ? (
                      <span className="text-rose-400">{job.error}</span>
                    ) : (
                      <span className="text-zinc-500">Pending</span>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <footer className="mt-12 text-sm text-zinc-500">
          Set the Telegram bot webhook to `/api/telegram` with the configured secret token to start shipping.
        </footer>
      </div>
    </div>
  );
}

function formatDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

function statusLabel(status: JobRecord['status']) {
  switch (status) {
    case 'queued':
      return 'Queued';
    case 'gathering':
      return 'Researching';
    case 'generating-script':
      return 'Scripting';
    case 'generating-assets':
      return 'Assets';
    case 'rendering-video':
      return 'Rendering';
    case 'uploading':
      return 'Uploading';
    case 'notifying':
      return 'Publishing';
    case 'completed':
      return 'Complete';
    case 'failed':
      return 'Failed';
    default:
      return status;
  }
}

function statusBadge(status: JobRecord['status']) {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40';
    case 'failed':
      return 'bg-rose-500/10 text-rose-300 border border-rose-500/40';
    case 'queued':
      return 'bg-zinc-700/30 text-zinc-300 border border-zinc-500/40';
    default:
      return 'bg-blue-500/10 text-blue-200 border border-blue-500/40';
  }
}
