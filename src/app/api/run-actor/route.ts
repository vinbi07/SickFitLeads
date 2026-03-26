import { NextResponse } from "next/server";
import { z } from "zod";
import { getApifyToken } from "@/lib/env";
import { getAuthenticatedUser } from "@/lib/api-auth";

export const runtime = "nodejs";

const ACTOR_ID = "IoSHqwTR9YGhzccez";
const MAX_FETCH_COUNT = 100_000;

const payloadSchema = z.object({
  fetch_count: z.number().int().positive().max(MAX_FETCH_COUNT).optional(),
  file_name: z.string().trim().min(1).max(120).optional(),
  contact_job_title: z.array(z.string().trim().min(1)).optional(),
  contact_not_job_title: z.array(z.string().trim().min(1)).optional(),
  seniority_level: z.array(z.string().trim().min(1)).optional(),
  functional_level: z.array(z.string().trim().min(1)).optional(),
  contact_location: z.array(z.string().trim().min(1)).optional(),
  contact_city: z.array(z.string().trim().min(1)).optional(),
  contact_not_location: z.array(z.string().trim().min(1)).optional(),
  contact_not_city: z.array(z.string().trim().min(1)).optional(),
  email_status: z.array(z.string().trim().min(1)).optional(),
  company_domain: z.array(z.string().trim().min(1)).optional(),
  size: z.array(z.string().trim().min(1)).optional(),
  company_industry: z.array(z.string().trim().min(1)).optional(),
  company_not_industry: z.array(z.string().trim().min(1)).optional(),
  company_keywords: z.array(z.string().trim().min(1)).optional(),
  company_not_keywords: z.array(z.string().trim().min(1)).optional(),
  min_revenue: z.array(z.string().trim().min(1)).optional(),
  max_revenue: z.array(z.string().trim().min(1)).optional(),
  funding: z.array(z.string().trim().min(1)).optional(),
});

type ActorPayload = z.infer<typeof payloadSchema>;

type DatasetLead = {
  full_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  email_status?: string;
  company_name?: string;
};

const SENIORITY_ALIASES: Record<string, string> = {
  founder: "founder",
  owner: "owner",
  "c-level": "c_suite",
  "c level": "c_suite",
  c_level: "c_suite",
  c_suite: "c_suite",
  director: "director",
  partner: "partner",
  vp: "vp",
  head: "head",
  manager: "manager",
  senior: "senior",
  entry: "entry",
  trainee: "trainee",
};

const FUNCTIONAL_ALIASES: Record<string, string> = {
  "c-level": "c_suite",
  "c level": "c_suite",
  c_level: "c_suite",
  c_suite: "c_suite",
  finance: "finance",
  product: "product_management",
  "product management": "product_management",
  product_management: "product_management",
  engineering: "engineering",
  design: "design",
  education: "education",
  hr: "human_resources",
  "human resources": "human_resources",
  human_resources: "human_resources",
  it: "information_technology",
  "information technology": "information_technology",
  information_technology: "information_technology",
  legal: "legal",
  marketing: "marketing",
  operations: "operations",
  sales: "sales",
  support: "support",
};

const EMAIL_STATUS_ALIASES: Record<string, string> = {
  validated: "validated",
  not_validated: "not_validated",
  "not validated": "not_validated",
  unknown: "unknown",
};

const SIZE_ALIASES: Record<string, string> = {
  "0-1": "1-10",
  "1-10": "1-10",
  "2-10": "1-10",
  "11-20": "11-20",
  "21-50": "21-50",
  "51-100": "51-100",
  "101-200": "101-200",
  "201-500": "201-500",
  "501-1000": "501-1000",
  "1001-2000": "1001-2000",
  "2001-5000": "2001-5000",
  "5001-10000": "5001-10000",
  "10000+": "10001-20000",
  "10001-20000": "10001-20000",
  "20001-50000": "20001-50000",
  "50000+": "50000+",
};

function compactArray(values?: string[]) {
  if (!values?.length) {
    return undefined;
  }
  const compacted = values.map((item) => item.trim()).filter(Boolean);
  return compacted.length ? compacted : undefined;
}

function normalizeTextArray(values?: string[]) {
  const compacted = compactArray(values);
  if (!compacted?.length) {
    return undefined;
  }

  const normalized = compacted
    .map((value) => value.toLowerCase().replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return normalized.length ? Array.from(new Set(normalized)) : undefined;
}

function normalizeEnumArray(
  values: string[] | undefined,
  aliases: Record<string, string>,
) {
  const compacted = compactArray(values);
  if (!compacted?.length) {
    return undefined;
  }

  const normalized = compacted
    .map((value) => {
      const key = value.toLowerCase().replace(/\s+/g, " ").trim();
      return aliases[key] ?? aliases[key.replace(/\s/g, "_")] ?? null;
    })
    .filter((value): value is string => Boolean(value));

  return normalized.length ? Array.from(new Set(normalized)) : undefined;
}

function buildActorInput(payload: ActorPayload) {
  const mapped = {
    fetch_count: payload.fetch_count ?? 100000,
    file_name: payload.file_name ?? "Prospects",
    contact_job_title: compactArray(payload.contact_job_title),
    contact_not_job_title: compactArray(payload.contact_not_job_title),
    seniority_level: normalizeEnumArray(payload.seniority_level, SENIORITY_ALIASES),
    functional_level: normalizeEnumArray(payload.functional_level, FUNCTIONAL_ALIASES),
    contact_location: normalizeTextArray(payload.contact_location),
    contact_city: normalizeTextArray(payload.contact_city),
    contact_not_location: normalizeTextArray(payload.contact_not_location),
    contact_not_city: normalizeTextArray(payload.contact_not_city),
    email_status:
      normalizeEnumArray(payload.email_status, EMAIL_STATUS_ALIASES) ?? ["validated"],
    company_domain: compactArray(payload.company_domain),
    size: normalizeEnumArray(payload.size, SIZE_ALIASES),
    company_industry: compactArray(payload.company_industry),
    company_not_industry: compactArray(payload.company_not_industry),
    company_keywords: compactArray(payload.company_keywords),
    company_not_keywords: compactArray(payload.company_not_keywords),
    min_revenue: compactArray(payload.min_revenue),
    max_revenue: compactArray(payload.max_revenue),
    funding: compactArray(payload.funding),
  };

  return Object.fromEntries(
    Object.entries(mapped).filter(([, value]) => value !== undefined),
  );
}

function mapToLead(item: DatasetLead, userId: string) {
  const fullName = item.full_name?.trim();
  const first = item.first_name?.trim() ?? "";
  const last = item.last_name?.trim() ?? "";

  return {
    user_id: userId,
    name: fullName || `${first} ${last}`.trim() || "Unknown",
    email: item.email?.trim() || "",
    company: item.company_name?.trim() || "",
    source: "apify",
    email_status: item.email_status?.trim() || "unknown",
  };
}

function chunkArray<T>(array: T[], size = 500): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < array.length; index += size) {
    chunks.push(array.slice(index, index + size));
  }
  return chunks;
}

function getFriendlyActorError(error: unknown) {
  const rawMessage = error instanceof Error ? error.message : "Actor run failed.";
  const normalized = rawMessage.toLowerCase();

  if (
    normalized.includes("free apify plan") &&
    normalized.includes("run the actor through the ui")
  ) {
    return {
      message:
        "Your Apify account is on the free plan, which blocks API-triggered runs for this actor. Upgrade your Apify plan to run from this dashboard, or run it manually in Apify UI.",
      isPlanRestriction: true,
    };
  }

  return { message: rawMessage, isPlanRestriction: false };
}

export async function POST(request: Request) {
  const { user, supabase, unauthorized } = await getAuthenticatedUser();
  if (!user) {
    return unauthorized;
  }

  const json = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid filter input." },
      { status: 400 },
    );
  }

  const actorInput = buildActorInput(parsed.data);

  const { data: createdJob, error: createJobError } = await supabase
    .from("jobs")
    .insert({
      user_id: user.id,
      actor_id: ACTOR_ID,
      status: "running",
      run_id: null,
      lead_count: 0,
      message: "Scraper started.",
    })
    .select("id")
    .single();

  if (createJobError || !createdJob) {
    return NextResponse.json(
      { success: false, message: "Failed to create job record." },
      { status: 500 },
    );
  }

  try {
    const { ApifyClient } = await import("apify-client");
    const client = new ApifyClient({ token: getApifyToken() });
    const run = await client.actor(ACTOR_ID).call(actorInput);

    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    const datasetItems = items as DatasetLead[];

    if (!datasetItems.length) {
      await supabase
        .from("jobs")
        .update({
          status: "completed",
          run_id: run.id,
          lead_count: 0,
          message: "Run completed with no dataset items.",
        })
        .eq("id", createdJob.id)
        .eq("user_id", user.id);

      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        message: "Run completed but no leads were found.",
      });
    }

    const leadsToInsert = datasetItems.map((item) => mapToLead(item, user.id));

    for (const chunk of chunkArray(leadsToInsert, 500)) {
      const { error: insertError } = await supabase.from("leads").insert(chunk);
      if (insertError) {
        throw new Error("Failed to save scraped leads.");
      }
    }

    const { data: insertedLeads, error: selectInsertedError } = await supabase
      .from("leads")
      .select("id,user_id,name,email,company,source,email_status,last_contacted_at,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(leadsToInsert.length);

    if (selectInsertedError) {
      throw new Error("Leads were saved but could not be loaded for response.");
    }

    await supabase
      .from("jobs")
      .update({
        status: "completed",
        run_id: run.id,
        lead_count: leadsToInsert.length,
        message: `Run completed. ${leadsToInsert.length} leads saved.`,
      })
      .eq("id", createdJob.id)
      .eq("user_id", user.id);

    return NextResponse.json({
      success: true,
      data: insertedLeads,
      count: leadsToInsert.length,
      message: "Scrape completed successfully.",
    });
  } catch (error) {
    const friendly = getFriendlyActorError(error);

    await supabase
      .from("jobs")
      .update({
        status: "failed",
        message: friendly.message,
      })
      .eq("id", createdJob.id)
      .eq("user_id", user.id);

    return NextResponse.json(
      {
        success: false,
        message: friendly.message,
        code: friendly.isPlanRestriction ? "APIFY_PLAN_RESTRICTION" : "ACTOR_RUN_FAILED",
      },
      { status: friendly.isPlanRestriction ? 403 : 500 },
    );
  }
}
