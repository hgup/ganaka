"use client";

import { LeftSidebar } from "./components/layout/LeftSidebar";
import { RightSidebar } from "./components/layout/RightSidebar";
import dynamic from "next/dynamic";

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

export default function Body() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <LeftSidebar />
      <ClientCanvas />
      <RightSidebar />
    </div>
  );
}
