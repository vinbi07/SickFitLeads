export type Lead = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  company: string;
  source: string;
  email_status: string | null;
  last_contacted_at: string | null;
  created_at: string;
};

export type Job = {
  id: string;
  user_id: string;
  actor_id: string;
  status: "running" | "completed" | "failed";
  run_id: string | null;
  lead_count: number;
  message: string | null;
  created_at: string;
};

export type RunActorRequest = {
  fetch_count?: number;
  file_name?: string;
  contact_job_title?: string[];
  contact_not_job_title?: string[];
  seniority_level?: string[];
  functional_level?: string[];
  contact_location?: string[];
  contact_city?: string[];
  contact_not_location?: string[];
  contact_not_city?: string[];
  email_status?: string[];
  company_domain?: string[];
  size?: string[];
  company_industry?: string[];
  company_not_industry?: string[];
  company_keywords?: string[];
  company_not_keywords?: string[];
  min_revenue?: string[];
  max_revenue?: string[];
  funding?: string[];
};

export type RunActorResponse = {
  success: boolean;
  data: Lead[];
  count: number;
  message?: string;
};
