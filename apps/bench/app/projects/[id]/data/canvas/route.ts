import { fetchCanvasProjectFetchCanvasGet } from "@api/project/project";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const {id: projectId} = await params

    // 1. Validate the input
    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    const results = await fetchCanvasProjectFetchCanvasGet({
      project_id: projectId,
    });

    if (results.status !== 200)
      return NextResponse.json(
        { error: "Backend error" },
        { status: results.status },
      );

    const canvas_json = results.data.canvas_json;

    // 3. Return the data with appropriate headers
    return NextResponse.json(canvas_json, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0", // Prevents stale actuarial data
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch project data" },
      { status: 500 },
    );
  }
}
