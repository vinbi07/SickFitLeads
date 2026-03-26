"use client";

import { FormEvent, useMemo, useState } from "react";
import { RunActorRequest } from "@/types/app";

type RunActorFormProps = {
  isLoading: boolean;
  onSubmit: (payload: RunActorRequest) => void;
};

type FormState = {
  fetch_count: string;
  file_name: string;
  contact_job_title: string;
  contact_not_job_title: string;
  seniority_level: string[];
  functional_level: string[];
  contact_location: string;
  contact_city: string;
  contact_not_location: string;
  contact_not_city: string;
  email_status: string[];
  company_domain: string;
  size: string[];
  company_industry: string;
  company_not_industry: string;
  company_keywords: string;
  company_not_keywords: string;
  min_revenue: string[];
  max_revenue: string[];
  funding: string[];
};

type Preset = {
  id: "saas-founders" | "local-businesses" | "recruiters";
  label: string;
  description: string;
  values: Partial<FormState>;
};

const initialFormState: FormState = {
  fetch_count: "",
  file_name: "Prospects",
  contact_job_title: "",
  contact_not_job_title: "",
  seniority_level: [],
  functional_level: [],
  contact_location: "",
  contact_city: "",
  contact_not_location: "",
  contact_not_city: "",
  email_status: ["validated"],
  company_domain: "",
  size: [],
  company_industry: "",
  company_not_industry: "",
  company_keywords: "",
  company_not_keywords: "",
  min_revenue: [],
  max_revenue: [],
  funding: [],
};

const SENIORITY_OPTIONS = [
  "Founder",
  "Owner",
  "C-Level",
  "Director",
  "VP",
  "Head",
  "Manager",
  "Senior",
  "Entry",
  "Trainee",
];

const FUNCTIONAL_OPTIONS = [
  "C-Level",
  "Finance",
  "Product",
  "Engineering",
  "Design",
  "HR",
  "IT",
  "Legal",
  "Marketing",
  "Operations",
  "Sales",
  "Support",
];

const EMAIL_STATUS_OPTIONS = ["validated", "not_validated", "unknown"];

const COMPANY_SIZE_OPTIONS = [
  "1-10",
  "11-20",
  "21-50",
  "51-100",
  "101-200",
  "201-500",
  "501-1000",
  "1001-2000",
  "2001-5000",
  "5001-10000",
  "10001-20000",
  "20001-50000",
  "50000+",
];

const REVENUE_OPTIONS = [
  "100K",
  "250K",
  "500K",
  "1M",
  "5M",
  "10M",
  "50M",
  "100M",
  "500M",
  "1B",
  "5B",
  "10B",
];

const FUNDING_OPTIONS = [
  "Seed",
  "Angel",
  "Series A",
  "Series B",
  "Series C",
  "Series D",
  "Series E",
  "Series F",
  "Venture",
  "Debt",
  "Convertible",
  "PE",
  "Other",
];

const presets: Preset[] = [
  {
    id: "saas-founders",
    label: "SaaS Founders",
    description: "Founders and C-level contacts in software companies.",
    values: {
      file_name: "SaaS Founders",
      contact_job_title: "founder, co-founder, ceo, cto",
      seniority_level: ["Founder", "C-Level", "Owner"],
      functional_level: ["C-Level", "Engineering", "Product"],
      company_industry: "software, saas, information technology",
      size: ["2-10", "11-20", "21-50", "51-100"],
      email_status: ["validated"],
    },
  },
  {
    id: "local-businesses",
    label: "Local Businesses",
    description: "Owners and managers at service-based local companies.",
    values: {
      file_name: "Local Businesses",
      contact_job_title: "owner, founder, general manager",
      seniority_level: ["Owner", "Founder", "Manager"],
      company_keywords: "local business, home services, small business",
      size: ["0-1", "2-10", "11-20", "21-50"],
      email_status: ["validated"],
    },
  },
  {
    id: "recruiters",
    label: "Recruiters",
    description: "Recruiting and talent acquisition decision-makers.",
    values: {
      file_name: "Recruiters",
      contact_job_title: "recruiter, talent acquisition, head of talent",
      seniority_level: ["Head", "Director", "Manager", "Senior"],
      functional_level: ["HR", "Operations"],
      company_industry: "staffing and recruiting, human resources",
      email_status: ["validated"],
    },
  },
];

function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function getMultiSelectValues(event: React.ChangeEvent<HTMLSelectElement>) {
  return Array.from(event.target.selectedOptions).map((option) => option.value);
}

export function RunActorForm({ isLoading, onSubmit }: RunActorFormProps) {
  const [state, setState] = useState<FormState>(initialFormState);
  const [selectedPreset, setSelectedPreset] = useState<Preset["id"] | null>(null);

  const fetchCountHelp = useMemo(() => {
    const value = Number(state.fetch_count);
    if (!value || Number.isNaN(value)) {
      return "Leave blank to use default actor fetch count.";
    }
    if (value > 1000) {
      return "Large requests can take longer. Start with 1000 for testing.";
    }
    return "Good for a fast test run.";
  }, [state.fetch_count]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: RunActorRequest = {
      fetch_count: state.fetch_count ? Number(state.fetch_count) : undefined,
      file_name: state.file_name || undefined,
      contact_job_title: splitCsv(state.contact_job_title),
      contact_not_job_title: splitCsv(state.contact_not_job_title),
      seniority_level: state.seniority_level,
      functional_level: state.functional_level,
      contact_location: splitCsv(state.contact_location),
      contact_city: splitCsv(state.contact_city),
      contact_not_location: splitCsv(state.contact_not_location),
      contact_not_city: splitCsv(state.contact_not_city),
      email_status: state.email_status,
      company_domain: splitCsv(state.company_domain),
      size: state.size,
      company_industry: splitCsv(state.company_industry),
      company_not_industry: splitCsv(state.company_not_industry),
      company_keywords: splitCsv(state.company_keywords),
      company_not_keywords: splitCsv(state.company_not_keywords),
      min_revenue: state.min_revenue,
      max_revenue: state.max_revenue,
      funding: state.funding,
    };

    onSubmit(payload);
  }

  function applyPreset(preset: Preset) {
    setSelectedPreset(preset.id);
    setState((prev) => ({
      ...prev,
      ...preset.values,
    }));
  }

  function resetToDefault() {
    setSelectedPreset(null);
    setState(initialFormState);
  }

  return (
    <section className="panel p-5">
      <h2 className="text-lg font-semibold">Run Lead Scraper</h2>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Enter your criteria and click Run Scraper. We will save all leads to your dashboard.
      </p>

      <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold">Quick presets</h3>
            <p className="text-xs text-[var(--color-muted)]">
              Start with a ready-made audience, then edit any field if needed.
            </p>
          </div>
          <button type="button" className="btn-secondary" onClick={resetToDefault}>
            Reset
          </button>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                selectedPreset === preset.id
                  ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)]"
                  : "border-[var(--color-border)] bg-white hover:bg-[#f5faf8]"
              }`}
            >
              <p className="text-sm font-semibold">{preset.label}</p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <details className="rounded-xl border border-[var(--color-border)] bg-white p-4" open>
          <summary className="cursor-pointer text-sm font-semibold">General</summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="fetch_count">
                Max leads to fetch
              </label>
              <input
                id="fetch_count"
                className="input-base"
                type="number"
                min={1}
                placeholder="Leave empty for all matches"
                value={state.fetch_count}
                onChange={(event) => setState((prev) => ({ ...prev, fetch_count: event.target.value }))}
              />
              <p className="mt-1 text-xs text-[var(--color-muted)]">{fetchCountHelp}</p>
            </div>
            <div>
              <label className="field-label" htmlFor="file_name">
                Run label
              </label>
              <input
                id="file_name"
                className="input-base"
                value={state.file_name}
                onChange={(event) => setState((prev) => ({ ...prev, file_name: event.target.value }))}
              />
            </div>
          </div>
        </details>

        <details className="rounded-xl border border-[var(--color-border)] bg-white p-4" open>
          <summary className="cursor-pointer text-sm font-semibold">People targeting</summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="field-label" htmlFor="contact_job_title">
                Include job titles (comma separated)
              </label>
              <input
                id="contact_job_title"
                className="input-base"
                placeholder="realtor, software developer, teacher"
                value={state.contact_job_title}
                onChange={(event) => setState((prev) => ({ ...prev, contact_job_title: event.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <label className="field-label" htmlFor="contact_not_job_title">
                Exclude job titles (comma separated)
              </label>
              <input
                id="contact_not_job_title"
                className="input-base"
                value={state.contact_not_job_title}
                onChange={(event) =>
                  setState((prev) => ({ ...prev, contact_not_job_title: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="field-label" htmlFor="seniority_level">
                Seniority level
              </label>
              <select
                id="seniority_level"
                className="input-base min-h-36"
                multiple
                value={state.seniority_level}
                onChange={(event) =>
                  setState((prev) => ({ ...prev, seniority_level: getMultiSelectValues(event) }))
                }
              >
                {SENIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="functional_level">
                Functional level
              </label>
              <select
                id="functional_level"
                className="input-base min-h-36"
                multiple
                value={state.functional_level}
                onChange={(event) =>
                  setState((prev) => ({ ...prev, functional_level: getMultiSelectValues(event) }))
                }
              >
                {FUNCTIONAL_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </details>

        <details className="rounded-xl border border-[var(--color-border)] bg-white p-4" open>
          <summary className="cursor-pointer text-sm font-semibold">Location (Include)</summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="contact_location">
                Region/Country/State (comma separated)
              </label>
              <input
                id="contact_location"
                className="input-base"
                placeholder="EMEA, United States, California"
                value={state.contact_location}
                onChange={(event) => setState((prev) => ({ ...prev, contact_location: event.target.value }))}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="contact_city">
                Cities (comma separated)
              </label>
              <input
                id="contact_city"
                className="input-base"
                placeholder="San Francisco, Austin"
                value={state.contact_city}
                onChange={(event) => setState((prev) => ({ ...prev, contact_city: event.target.value }))}
              />
            </div>
          </div>
        </details>

        <details className="rounded-xl border border-[var(--color-border)] bg-white p-4" open>
          <summary className="cursor-pointer text-sm font-semibold">Location (Exclude)</summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="contact_not_location">
                Exclude Region/Country/State
              </label>
              <input
                id="contact_not_location"
                className="input-base"
                value={state.contact_not_location}
                onChange={(event) =>
                  setState((prev) => ({ ...prev, contact_not_location: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="field-label" htmlFor="contact_not_city">
                Exclude cities
              </label>
              <input
                id="contact_not_city"
                className="input-base"
                value={state.contact_not_city}
                onChange={(event) => setState((prev) => ({ ...prev, contact_not_city: event.target.value }))}
              />
            </div>
          </div>
        </details>

        <details className="rounded-xl border border-[var(--color-border)] bg-white p-4" open>
          <summary className="cursor-pointer text-sm font-semibold">Email quality</summary>
          <div className="mt-4">
            <label className="field-label" htmlFor="email_status">
              Email status
            </label>
            <select
              id="email_status"
              className="input-base"
              value={state.email_status[0] ?? "validated"}
              onChange={(event) => setState((prev) => ({ ...prev, email_status: [event.target.value] }))}
            >
              {EMAIL_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </details>

        <details className="rounded-xl border border-[var(--color-border)] bg-white p-4" open>
          <summary className="cursor-pointer text-sm font-semibold">Company targeting</summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="field-label" htmlFor="company_domain">
                Company domains (comma separated)
              </label>
              <input
                id="company_domain"
                className="input-base"
                placeholder="google.com, https://apple.com"
                value={state.company_domain}
                onChange={(event) => setState((prev) => ({ ...prev, company_domain: event.target.value }))}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="size">
                Company size
              </label>
              <select
                id="size"
                className="input-base min-h-40"
                multiple
                value={state.size}
                onChange={(event) => setState((prev) => ({ ...prev, size: getMultiSelectValues(event) }))}
              >
                {COMPANY_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="funding">
                Funding
              </label>
              <select
                id="funding"
                className="input-base min-h-40"
                multiple
                value={state.funding}
                onChange={(event) => setState((prev) => ({ ...prev, funding: getMultiSelectValues(event) }))}
              >
                {FUNDING_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="company_industry">
                Include industries (comma separated)
              </label>
              <input
                id="company_industry"
                className="input-base"
                value={state.company_industry}
                onChange={(event) => setState((prev) => ({ ...prev, company_industry: event.target.value }))}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="company_not_industry">
                Exclude industries (comma separated)
              </label>
              <input
                id="company_not_industry"
                className="input-base"
                value={state.company_not_industry}
                onChange={(event) =>
                  setState((prev) => ({ ...prev, company_not_industry: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="field-label" htmlFor="company_keywords">
                Include keywords (comma separated)
              </label>
              <input
                id="company_keywords"
                className="input-base"
                value={state.company_keywords}
                onChange={(event) => setState((prev) => ({ ...prev, company_keywords: event.target.value }))}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="company_not_keywords">
                Exclude keywords (comma separated)
              </label>
              <input
                id="company_not_keywords"
                className="input-base"
                value={state.company_not_keywords}
                onChange={(event) =>
                  setState((prev) => ({ ...prev, company_not_keywords: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="field-label" htmlFor="min_revenue">
                Min revenue
              </label>
              <select
                id="min_revenue"
                className="input-base"
                value={state.min_revenue[0] ?? ""}
                onChange={(event) =>
                  setState((prev) => ({
                    ...prev,
                    min_revenue: event.target.value ? [event.target.value] : [],
                  }))
                }
              >
                <option value="">Any</option>
                {REVENUE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="max_revenue">
                Max revenue
              </label>
              <select
                id="max_revenue"
                className="input-base"
                value={state.max_revenue[0] ?? ""}
                onChange={(event) =>
                  setState((prev) => ({
                    ...prev,
                    max_revenue: event.target.value ? [event.target.value] : [],
                  }))
                }
              >
                <option value="">Any</option>
                {REVENUE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </details>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Scraping leads..." : "Run Scraper"}
        </button>
      </form>
    </section>
  );
}
