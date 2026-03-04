"use client";

import { useUIStore } from "@/store/useUIStore";
import { LeftSidebar } from "./components/layout/LeftSidebar";
import { RightSidebar } from "./components/layout/RightSidebar";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import TopBar from "./components/layout/TopBar";
import { useCanvasStore } from "@/store/useCanvasStore";

// 1. Dynamically import the Canvas component
const ClientCanvas = dynamic(
  () => import("./components/canvas"), // Path to your canvas component
  {
    ssr: false, // Tell Next.js to NEVER render this on the server
    loading: () => (
      // Provide a native skeleton/loading state
      <div className="w-full h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground font-mono pb-40">
          Loading Ganaka Workbench...
        </div>
      </div>
    ),
  },
);

// ─── Main Layout ──────────────────────────────────────────────────────────────

export default function Main({
  project_name,
  project_id,
}: {
  project_id: string;
  project_name: string;
}) {
  const initStore = useUIStore((s) => s.initialize);
  const initCanvas = useCanvasStore((s) => s.init);
  const clear = useCanvasStore((s) => s.clear);
  useEffect(() => {
    initStore(project_id);
    initCanvas(project_id);

    return () => {
      clear();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <TopBar name={project_name} />
        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar />
          <ClientCanvas />
          <RightSidebar />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
