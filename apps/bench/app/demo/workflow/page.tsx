"use client";

import { useActionState, useState, useTransition } from "react";
import {
  uploadClaimsAction,
  fetchTriangleAction,
  TriangleResponse,
  UploadState,
} from "./actions";
import { GetTriangleWorkflowAggregateTrianglePostBody } from "@api/schemas/getTriangleWorkflowAggregateTrianglePostBody.zod";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { ModeToggle } from "@components/theme-button";

const initialUploadState: UploadState = {};

export default function GanakaWorkbench() {
  const [uploadState, formAction, isUploading] = useActionState(
    uploadClaimsAction,
    initialUploadState,
  );
  const [activeLob, setActiveLob] = useState<string>("");

  // Update state to hold the full response object
  const [triangleData, setTriangleData] = useState<TriangleResponse | null>(
    null,
  );
  const [isAggregating, startTransition] = useTransition();

  const handleLobChange = (selectedLob: string) => {
    setActiveLob(selectedLob);

    if (!selectedLob || !uploadState.sessionId) return;

    startTransition(async () => {
      try {
        const result = await fetchTriangleAction(
          uploadState.sessionId!,
          selectedLob,
        );
        setTriangleData(result);
      } catch {
        alert("Error generating triangle.");
      }
    });
  };

  return (
    <div className="md:p-10 max-w-6xl mx-auto font-sans">
      <header className="mb-8 border-b pb-4  max-md:p-4 max-md:mt-10">
        <h1 className="text-3xl font-bold text-accent">Ganaka Workbench</h1>
        <p className="text-muted-foreground">
          Chainladder Triangle Aggregation
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT COLUMN: Controls */}

        {/* Upload Section */}
        <div className="p-5 rounded-lg border shadow-sm">
          <h2 className="font-semibold mb-3">Load Granular Data</h2>
          <form action={formAction} className="space-y-4">
            <Input
              type="file"
              name="file"
              accept=".csv, .parquet"
              required
              className="block w-full"
            />
            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading ? "Ingesting..." : "Upload Data"}
            </Button>
          </form>
          {uploadState.sessionId && (
            <div className="mt-3 text-sm text-accent font-semibold">
              ✅ Session Active
            </div>
          )}
        </div>

        {/* LOB Selector */}
        <div
          className={`p-5 rounded-lg border shadow-sm ${!uploadState.sessionId && "opacity-50 pointer-events-none"}  flex flex-wrap gap-4`}
        >
          <Select onValueChange={handleLobChange}>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Select Aggregation" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Aggregate</SelectLabel>
                {uploadState.lobs?.map((lob) => (
                  <SelectItem key={lob} value={lob}>
                    {lob}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <ModeToggle />
        </div>

        {/* RIGHT COLUMN: Triangle View */}
        <div className="md:col-span-3">
          <div className="p-6 rounded-lg border shadow-sm min-h-100 overflow-auto">
            <h2 className="font-bold mb-6">
              {activeLob
                ? `${activeLob} - Paid Claims Triangle`
                : "Triangle View"}
            </h2>

            {isAggregating ? (
              <div className="flex h-64 items-center justify-center animate-pulse">
                Running Chainladder...
              </div>
            ) : triangleData ? (
              <Table>
                {/* 1. Development Periods (Columns) */}
                <TableHeader>
                  <TableRow>
                    <TableHead>Origin</TableHead>
                    {triangleData.dev_indexes.map((dev) => (
                      <TableHead key={dev} className="text-center">
                        {dev}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                {/* 2. Main Triangle Data */}
                <TableBody>
                  {triangleData.triangle.map((row, rIdx) => (
                    <TableRow key={rIdx}>
                      {/* Origin Period (Row Header) */}
                      <TableCell>
                        {new Date(
                          triangleData.origin_indexes[rIdx],
                        ).getFullYear()}
                      </TableCell>

                      {/* Triangle Cells */}
                      {row.map((val, cIdx) => (
                        <TableCell key={cIdx} className="text-center">
                          {val !== null
                            ? val.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })
                            : ""}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>

                {/* 3. Age-to-Age Factors (LDFs) */}
                <TableFooter>
                  <TableRow>
                    <TableCell className="text-accent">Selected LDFs</TableCell>
                    {/* The LDF array is 1 element shorter than the columns, so we map up to length - 1 */}
                    {triangleData.dev_indexes.slice(0, -1).map((_, idx) => (
                      <td
                        key={`ldf-${idx}`}
                        className="text-accent font-semibold text-center"
                      >
                        {triangleData.ldfs[idx] !== null &&
                        triangleData.ldfs[idx] !== undefined
                          ? triangleData.ldfs[idx]?.toFixed(3)
                          : ""}
                      </td>
                    ))}
                    {/* Empty cell for the final development column (no subsequent period to develop to) */}
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            ) : (
              <div className="flex h-64 items-center justify-center p-4 text-pretty text-xs border-2 border-dashed rounded">
                Upload data to initialize the workspace.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
