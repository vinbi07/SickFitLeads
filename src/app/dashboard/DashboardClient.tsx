"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { JobStatusList } from "@/components/JobStatusList";
import { LeadTable } from "@/components/LeadTable";
import { RunActorForm } from "@/components/RunActorForm";
import { useJobs } from "@/hooks/useJobs";
import { useLeads } from "@/hooks/useLeads";
import { useRunActor } from "@/hooks/useRunActor";
import { RunActorRequest } from "@/types/app";

type DashboardClientProps = {
  userEmail: string;
};

export default function DashboardClient({ userEmail }: DashboardClientProps) {
  const leadsQuery = useLeads();
  const jobsQuery = useJobs();
  const { runActor, isLoading, error, data } = useRunActor();

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (data?.success) {
      toast.success(`Scrape completed. ${data.count} leads saved.`);
    }
  }, [data]);

  function handleSubmit(payload: RunActorRequest) {
    runActor(payload);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <RunActorForm isLoading={isLoading} onSubmit={handleSubmit} />
        <JobStatusList
          jobs={jobsQuery.data ?? []}
          isLoading={jobsQuery.isLoading}
        />
      </div>

      <LeadTable
        leads={leadsQuery.data ?? []}
        isLoading={leadsQuery.isLoading || isLoading}
      />

      <p className="text-xs text-[var(--color-muted)]" aria-live="polite">
        Signed in as {userEmail}
      </p>
    </div>
  );
}
