"use server";

import { confirmIngestDataConfirmIngestPost, uploadPreviewDataUploadPreviewPost } from "@api/reserving/reserving";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

export type PreviewData = {
  upload_id: string;
  headers: string[];
  preview_rows: Record<string, unknown>[];
};

// Unified Action approach
const mappingSchema = z.object({
  // These 4 are strictly required
  lob: z.string().min(1, "Please map the Line of Business column"),
  paid: z.string().min(1, "Please map the Paid/Amount column"),
  origin: z.string().min(1, "Please map the Origin/Accident Year column"),
  development: z.string().min(1, "Please map the Development/Lag column"),
}).catchall(z.string());

const Step1Schema = z.object({
  step: z.literal(1),
  projectName: z.string(),
  file: z.file(),
});
const Step2Schema = z.object({
  step: z.literal(2),
  uploadId: z.string(),
  projectName: z.string(),
  // columnMap: Record<string, string>,
  columnMap: z.string()
    // Step A: Safely parse the JSON string
    .transform((str, ctx) => {
      try {
        return JSON.parse(str);
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid JSON format" });
        return z.NEVER;
      }
    })
    // Step B: Pipe the parsed object into your actual schema
    .pipe(mappingSchema),
});
const FormSchema = z.discriminatedUnion("step", [Step1Schema, Step2Schema]);
type FormState =
  | {
      step: 1;
      error?: string;
    }
  | {
      step: 2;
      projectName: string;
      data: PreviewData;
      error?: string;
    }
  | {
      step: 3;
      projectName: string;
      projectId: string;
      error?: string;
    };

// Step 1: Upload and get headers
export async function uploadAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // TODO: Go back button
  // const intent = formData.get('intent')
  // if(intent === 'back'){
  //   if (intent === "back") {
  //   if (prevState.step === 2) return { step: 1 };
  //   if (prevState.step === 3) return { step: 2, data: prevState.data }; // Carry data back if needed
  // }
  // }
  const rawData = Object.fromEntries(formData);
  console.log(rawData)
  const validated = FormSchema.safeParse({
    ...rawData,
    step: Number(rawData.step),
  });

  if (!validated.success)
    return { ...prevState, error: validated.error.message };

  let dat;
  switch (validated.data.step) {
    case 1: // Preview Data
      dat = validated.data
      const preview_res = await uploadPreviewDataUploadPreviewPost({
        file: validated.data.file,
      });

      if (preview_res.status !== 200)
        return { ...prevState, error: "Backend connection failed." };

      // If everything is okay
      return { step: 2, data: preview_res.data, projectName: dat.projectName};

    case 2: // Confirm Ingest
      dat = validated.data;
      const confirm_res = await confirmIngestDataConfirmIngestPost({
        upload_id: dat.uploadId,
        project_name: dat.projectName,
        column_map: dat.columnMap,
      });
      if (confirm_res.status !== 200)
        return { ...prevState, error: "Backend connection failed." };
      revalidatePath('/dashboard')
      redirect(`/projects/${confirm_res.data.project_id}`)
  }
}