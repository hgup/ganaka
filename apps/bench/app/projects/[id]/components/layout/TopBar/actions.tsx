"use server";

import { saveCanvasProjectSaveCanvasPut } from "@api/project/project";
import z from "zod";

type FormState = {
  message: string;
  success: boolean;
};

const FormSchema = z.object({
  projectId: z.string(),
  canvasJson: z.string(),
});

export async function saveCanvas(prevState: FormState, formData: FormData) {
  const rawData = Object.fromEntries(formData);
  const { success, data } = FormSchema.safeParse(rawData);

  if (!success) return { message: "Failed#1", success: false };

  const res = await saveCanvasProjectSaveCanvasPut({
    project_id: data.projectId,
    canvas_json: data.canvasJson,
  });

  if (res.status != 200)
    return { message: "Failed from server", success: false };

  return {
    success: true,
    message: "success!",
  };
}
