"use client";

import { useQuery } from "@tanstack/react-query";
import { Job } from "@/types/app";

async function fetchJobs(): Promise<Job[]> {
  const response = await fetch("/api/jobs", { method: "GET" });
  if (!response.ok) {
    throw new Error("Unable to fetch jobs.");
  }

  const payload = (await response.json()) as { data: Job[] };
  return payload.data;
}

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
    refetchInterval: 20_000,
  });
}
