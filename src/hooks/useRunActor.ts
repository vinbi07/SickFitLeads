"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RunActorRequest, RunActorResponse } from "@/types/app";

async function runActorRequest(input: RunActorRequest): Promise<RunActorResponse> {
  const response = await fetch("/api/run-actor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as
    | RunActorResponse
    | { error?: string; message?: string };

  if (!response.ok) {
    const message =
      "message" in payload
        ? payload.message
        : "error" in payload
          ? payload.error
          : undefined;

    throw new Error(message ?? "Failed to run scraper.");
  }

  return payload as RunActorResponse;
}

export function useRunActor() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: runActorRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["leads"] }),
        queryClient.invalidateQueries({ queryKey: ["jobs"] }),
      ]);
    },
  });

  return {
    runActor: mutation.mutate,
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
