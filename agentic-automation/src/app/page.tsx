import { listJobs } from '@/lib/jobs-store';
import { JobDashboard } from './ui/job-dashboard';

export default async function Home() {
  const jobs = await listJobs();
  return <JobDashboard initialJobs={jobs} />;
}
