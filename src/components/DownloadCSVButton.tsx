"use client";

import Papa from "papaparse";
import { Lead } from "@/types/app";

type DownloadCSVButtonProps = {
  leads: Lead[];
};

export function DownloadCSVButton({ leads }: DownloadCSVButtonProps) {
  function handleDownload() {
    if (!leads.length) {
      return;
    }

    const csv = Papa.unparse(
      leads.map((lead) => ({
        Name: lead.name,
        Email: lead.email,
        Company: lead.company,
        Source: lead.source,
        Date: new Date(lead.created_at).toLocaleDateString(),
      })),
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = `leads-${new Date().toISOString().slice(0, 10)}.csv`;

    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      className="btn-secondary"
      onClick={handleDownload}
      disabled={!leads.length}
    >
      Download CSV
    </button>
  );
}
