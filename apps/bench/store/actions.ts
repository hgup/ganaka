"use server";

import { runActuarialMethodMethodsRunMethodPost } from "@api/project/project";
import { MethodNodeData, MethodType } from "./useCanvasStore";
import { MethodResults } from "@api/schemas/methodResults.zod";

export async function calculateMethodAction(params: {
  projectId: string;
  config: MethodNodeData["config"];
  sourceTableId: string;
  methodType: MethodType;
  columnName: string;
}): Promise<{success: true, results: MethodResults} | {success: false, error: string}> {
  try {
    const { status, data: data } =
      await runActuarialMethodMethodsRunMethodPost({
        project_id: params.projectId,
        config: params.config,
        source_table: params.sourceTableId,
        method_type: params.methodType,
        column_name: params.columnName
      });

    if (status === 200) {
      return { success: true, results: data.results };
    }

    return { success: false, error: "Calculation failed on engine" };
  } catch {
    return { success: false, error: "Server connection error" };
  }
}
