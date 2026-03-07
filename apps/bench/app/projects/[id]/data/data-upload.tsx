"use client";

import { useActionState, useEffect, useState } from "react";
import { uploadAction } from "./action";
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
import { useParams } from "next/navigation";
import { performAutoMapping, REQUIRED_FIELDS } from "./utils";
import { Separator } from "@ui/separator";
import { useUIStore } from "@/store/useUIStore";
import { toast } from "sonner";

export default function DataIngestionWizard() {
  const setUploading = useUIStore((s) => s.setUploadingDataset);
  const fetchDatasets = useUIStore((s) => s.fetchDatasets);
  const [state, action, pending] = useActionState(uploadAction, {
    step: 1,
  });
  const { id: projectId } = useParams<{ id: string }>();
  const [mapping, setMapping] = useState<Record<string, string>>({}); // { "User_Col": "canonical_col" }
  const [name, setName] = useState<string | null>(null);
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

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);
  useEffect(() => {
    // If the action successfully moved us to step 3, the upload is done!
    if (state.step === 3 && !state.error) {
      // 1. Close the wizard/modal
      setUploading(false);

      // 2. Refresh the datasets in the background so the UI updates
      fetchDatasets(projectId);
    }
  }, [state.step, state.error, projectId, setUploading, fetchDatasets]);

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

  let stepContent;
  switch (state.step) {
    case 1:
      stepContent = (
        <Field className="max-w-lg">
          <FieldLegend>Upload</FieldLegend>
          <FieldLabel htmlFor="file">CSV File</FieldLabel>
          <Input
            type="file"
            id="file"
            name="file"
            accept=".csv"
            required
            onChange={(e) => {
              if (name === null && e.target.files?.length) {
                setName(e.target.files.item(0)?.name ?? "");
              }
            }}
          />
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
        <FieldSet className="w-full">
          <FieldLegend>Map Columns</FieldLegend>
          <FieldDescription>
            {"Match your file's columns to the required database schema."}
          </FieldDescription>

          <FieldGroup className="grid gap-4">
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
                    <SelectTrigger className="w-full">
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

          <div className="flex gap-4 w-full">
            <input
              readOnly
              hidden
              name="uploadId"
              value={state.data.upload_id}
            />
            {/* <Button name="intent" value="back">Back</Button> */}
            <Button name="step" value="2" disabled={pending} className="w-full">
              {pending ? "Ingesting Data..." : "Confirm & Import"}
            </Button>
          </div>
        </FieldSet>
      );
      break;
    case 3:
      break;
  }

  return (
    <div className="flex flex-col justify-center mx-2">
      <Field className="max-w-lg mt-4">
        <FieldLegend className="mb-4 font-bold text-lg text-accent-foreground">
          New Dataset
        </FieldLegend>
        <FieldLabel htmlFor="datasetName">Name your dataset</FieldLabel>

        <Input
          defaultValue={state.step !== 1 ? state.datasetName : ""}
          type="text"
          id="datasetName"
          name="datasetName"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <FieldDescription>Enter a memorable name.</FieldDescription>
      </Field>
      <Separator className="my-6" />
      <form
        action={(formData: FormData) => {
          formData.append("projectId", projectId);
          formData.append("datasetName", name ?? "");
          formData.append("columnMap", JSON.stringify(mapping));
          action(formData);
        }}
      >
        {stepContent}
      </form>
    </div>
  );
}
