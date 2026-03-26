import { formatDistanceToNow } from "date-fns";
import { Job } from "@/types/app";

type JobStatusListProps = {
  jobs: Job[];
  isLoading: boolean;
};

const statusStyles: Record<Job["status"], string> = {
  running: "bg-amber-50 text-amber-800 border-amber-300",
  completed: "bg-emerald-50 text-emerald-800 border-emerald-300",
  failed: "bg-red-50 text-red-800 border-red-300",
};

export function JobStatusList({ jobs, isLoading }: JobStatusListProps) {
  return (
    <section className="panel p-5" aria-live="polite">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Scraping Jobs</h2>
        {isLoading ? (
          <span className="text-sm text-[var(--color-muted)]">
            Refreshing...
          </span>
        ) : null}
      </div>

      {!jobs.length ? (
        <p className="text-sm text-[var(--color-muted)]">
          No jobs yet. Run your first scraper above.
        </p>
      ) : (
        <ul className="space-y-3">
          {jobs.slice(0, 8).map((job) => (
            <li
              key={job.id}
              className="rounded-xl border border-[var(--color-border)] bg-white p-3"
            >
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="text-sm font-medium">
                  Actor {job.actor_id}
                </span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusStyles[job.status]}`}
                >
                  {job.status}
                </span>
              </div>
              <p className="text-xs text-[var(--color-muted)]">
                {job.lead_count} leads •{" "}
                {formatDistanceToNow(new Date(job.created_at), {
                  addSuffix: true,
                })}
              </p>
              {job.message ? (
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  {job.message}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
