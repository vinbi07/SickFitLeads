"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Lead } from "@/types/app";
import { DownloadCSVButton } from "@/components/DownloadCSVButton";

type LeadTableProps = {
  leads: Lead[];
  isLoading: boolean;
};

const columns: ColumnDef<Lead>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name || "-"}</span>
    ),
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Company",
    accessorKey: "company",
  },
  {
    header: "Source",
    accessorKey: "source",
  },
  {
    header: "Date",
    accessorKey: "created_at",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
];

export function LeadTable({ leads, isLoading }: LeadTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: leads,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _, filterValue) => {
      const search = String(filterValue).toLowerCase();
      return [
        row.original.name,
        row.original.email,
        row.original.company,
        row.original.source,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);
    },
  });

  const filteredRows = useMemo(
    () => table.getFilteredRowModel().rows.map((row) => row.original),
    [table, globalFilter, leads],
  );

  return (
    <section className="panel p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Leads</h2>
          <p className="text-sm text-[var(--color-muted)]">
            Search, filter, and export your saved leads.
          </p>
        </div>
        <DownloadCSVButton leads={filteredRows} />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          className="input-base max-w-md"
          placeholder="Search leads by name, email, company"
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
        />
        <p className="text-sm text-[var(--color-muted)]">
          {filteredRows.length} result{filteredRows.length === 1 ? "" : "s"}
        </p>
      </div>

      {!leads.length && !isLoading ? (
        <p className="rounded-xl border border-dashed border-[var(--color-border)] bg-white p-6 text-sm text-[var(--color-muted)]">
          No leads yet. Run the scraper above to populate your table.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-white">
          <table className="w-full border-collapse text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-[var(--color-border)] bg-[#f8faf9]"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3 py-2 text-left font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    className="px-3 py-6 text-center text-[var(--color-muted)]"
                    colSpan={columns.length}
                  >
                    Loading leads...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[var(--color-border)] last:border-b-0"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-2 align-top">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-3 py-6 text-center text-[var(--color-muted)]"
                    colSpan={columns.length}
                  >
                    No rows match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <p className="text-sm text-[var(--color-muted)]">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1}
        </p>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </section>
  );
}
