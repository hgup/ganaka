"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { uploadAction } from "./actions";
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
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@ui/field";
import { AlertDestructive } from "@components/alerts";
import { useRouter } from "next/navigation";
import { performAutoMapping, REQUIRED_FIELDS } from "./utils";

export default function DataIngestionWizard() {
  const [state, action, pending] = useActionState(uploadAction, {
    step: 1,
  });
  const router = useRouter();
  const [mapping, setMapping] = useState<Record<string, string>>({}); // { "User_Col": "canonical_col" }
  const handleMapChange = (value: string) => {
    const [canonicalKey, sourceHeader] = value.split("-");
    setMapping((prev) => {
      const newMap = { ...prev };
      // Remove any existing mapping for this canonical key to avoid duplicates
      Object.keys(newMap).forEach((k) => {
        if (newMap[k] === canonicalKey) delete newMap[k];
      });
      // Add the new mapping
      if (sourceHeader) newMap[sourceHeader] = canonicalKey;
      return newMap;
    });
  };

  const [lastMappedId, setLastMappedId] = useState<string | null>(null);
  if (
    state.step === 2 &&
    state.data?.upload_id &&
    lastMappedId !== state.data.upload_id
  ) {
    // We do this sync during render to avoid the "cascading effect"
    const initialMap = performAutoMapping(state.data.headers);
    setMapping(initialMap);
    setLastMappedId(state.data.upload_id);
  }
  useEffect(() => {
    if (state.step === 3 && state.projectId) {
      router.push(`/projects/${state.projectId}`);
    }
  }, [state, router]);

  let stepContent;
  switch (state.step) {
    case 1:
      stepContent = (
        <Field className="max-w-lg">
          <FieldLegend>Upload Raw Claims Data</FieldLegend>
          <FieldLabel htmlFor="file">CSV File</FieldLabel>
          <Input type="file" id="file" name="file" accept=".csv" required />
          <FieldDescription>Select a CSV file to upload.</FieldDescription>
          <Button name="step" value="1" disabled={pending}>
            {pending ? "Reading File..." : "Upload & Preview"}
          </Button>
        </Field>
      );
      break;
    case 2:
      const { headers } = state.data;
      stepContent = (
        <FieldSet className="max-w-xl">
          <FieldLegend>Map Columns</FieldLegend>
          <FieldDescription>
            {"Match your file's columns to the required database schema."}
          </FieldDescription>

          <FieldGroup className="grid grid-cols-2 gap-4">
            {REQUIRED_FIELDS.map((field) => {
              // Find if this field is currently mapped to a source header
              const currentMappedSource =
                Object.keys(mapping).find((k) => mapping[k] === field.key) ||
                "";

              return (
                <Field key={field.key}>
                  <FieldLabel>{field.label}</FieldLabel>
                  <FieldDescription>db: {field.key}</FieldDescription>

                  <Select
                    value={`${field.key}-${currentMappedSource}`}
                    onValueChange={handleMapChange}
                  >
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue placeholder="-- select matching column --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Column Names</SelectLabel>
                        {headers.map((sourceHeader) => (
                          <SelectItem
                            key={sourceHeader}
                            value={`${field.key}-${sourceHeader}`}
                          >
                            {sourceHeader}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              );
            })}
          </FieldGroup>

          <div className="flex gap-4">
            <input
              readOnly
              hidden
              name="uploadId"
              value={state.data.upload_id}
            />
            {/* <Button name="intent" value="back">Back</Button> */}
            <Button name="step" value="2" disabled={pending}>
              {pending ? "Ingesting Data..." : "Confirm & Import"}
            </Button>
          </div>
        </FieldSet>
      );
      break;
    case 3:
      router.push(`/projects/${state.projectId}`);
      break;
  }

  return (
    <div className="min-w-7xl mx-auto p-10 font-sans">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-accent">Workbench</h1>
        <p className="text-muted-foreground pt-2">Data Ingestion & Mapping</p>
      </header>

      {state.error && (
        <div className="mb-8">
          <AlertDestructive title="Error" description={state.error} />
        </div>
      )}
      <form
        action={(formData: FormData) => {
          formData.append("columnMap", JSON.stringify(mapping));
          action(formData);
        }}
      >
        <Field className="max-w-lg mb-8">
          <FieldLegend>Project Name</FieldLegend>
          <FieldLabel htmlFor="projectName">Name your project</FieldLabel>

          <Input
            defaultValue={state.step !== 1 ? state.projectName : ""}
            type="text"
            id="projectName"
            name="projectName"
            required
          />
          <FieldDescription>Enter a memorable name.</FieldDescription>
        </Field>
        {stepContent}
      </form>
    </div>
  );
}
