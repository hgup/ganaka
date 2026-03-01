'use server'

export type UploadState = {
  sessionId?: string;
  lobs?: string[];
  error?: string;
};

export type TriangleResponse = {
  triangle: (number | null)[][];
  origin_indexes: string[];
  dev_indexes: string[];
  ldfs: (number | null)[];
};

// Action 1: Ingest the granular data
export async function uploadClaimsAction(
  prevState: UploadState, 
  formData: FormData
): Promise<UploadState> {
  const file = formData.get('file') as File;
  
  if (!file || file.size === 0) {
    return { error: "Please select a valid CSV or Parquet file." };
  }

  try {
    // Forward the file to FastAPI
    const res = await fetch('http://localhost:8000/workflow/upload-claims', {
      method: 'POST',
      body: formData, 
    });
    
    if (!res.ok) throw new Error("Backend ingestion failed");
    
    const data = await res.json();
    return {
      sessionId: data.session_id,
      lobs: data.lobs,
    };
  } catch (err) {
    return { error: "Failed to connect to the compute engine." };
  }
}

export async function fetchTriangleAction(sessionId: string, lob: string): Promise<TriangleResponse> {
  const res = await fetch('http://localhost:8000/workflow/aggregate-triangle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, lob: lob })
  });
  
  if (!res.ok) throw new Error("Failed to aggregate triangle");
  return await res.json();
}