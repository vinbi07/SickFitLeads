"use client";

import { useQuery } from "@tanstack/react-query";
import { Lead } from "@/types/app";

async function fetchLeads(): Promise<Lead[]> {
  const response = await fetch("/api/leads", { method: "GET" });
  if (!response.ok) {
    throw new Error("Unable to fetch leads.");
  }

  const payload = (await response.json()) as { data: Lead[] };
  return payload.data;
}

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  });
}
