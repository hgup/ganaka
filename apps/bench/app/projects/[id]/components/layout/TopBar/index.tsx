"use client";
import {
  Loader,
  Play,
  SaveIcon,
  //   ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ThemeSwitch } from "./theme-switch";
import { useUIStore } from "@/store/useUIStore";
import { useActionState, useEffect } from "react";
import { saveCanvas } from "./actions";
import { useReactFlow } from "@xyflow/react";
import { useParams } from "next/navigation";

export default function TopBar(props: { name: string }) {
  return (
    <header className="flex items-center justify-between px-3 h-12 border-b bg-background shrink-0 z-10">
      {/* Left: app name + project */}
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 font-semibold text-sm"
        >
          <span className="text-accent-foreground">Ganaka</span>
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-sm font-normal"
        >
          {props.name}
          {/* <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> */}
        </Button>
        <Badge variant="outline" className="text-xs font-normal">
          Drafts
        </Badge>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <ThemeSwitch />
        <Separator orientation="vertical" />
        <RunAnalysis />
        {/* <Button variant="secondary" size="icon" className="h-7 w-8">
            </Button> */}
        <SaveCanvas />
      </div>
    </header>
  );
}

function RunAnalysis() {
  return (
    <Button
      variant="secondary"
      className="inline-flex h-7 gap-1 items-center px-4"
    >
      <Play className="h-4 w-4" /> <span>Run Analysis</span>
    </Button>
  );
}

function SaveCanvas() {
  const { id: project_id } = useParams<{ id: string }>();
  const changed = useUIStore((s) => s.changed);
  const setChanged = useUIStore((s) => s.setChanged);
  const { toObject } = useReactFlow();
  const [, action, isPending] = useActionState(saveCanvas, {
    message: "",
    success: false,
  });

  return (
    <form
      action={(formData) => {
        const flowSnapshot = JSON.stringify(toObject());
        formData.set("canvasJson", flowSnapshot);
        action(formData);
        setChanged(false);
      }}
    >
      <input hidden value={project_id} name="projectId" readOnly />
      <Button
        size="sm"
        variant={changed ? "default" : "ghost"}
        className="h-7 w-20 gap-1.5"
        disabled={!changed || isPending}
      >
        {changed ? (
          !isPending ? (
            <>
              <SaveIcon className="h-4 w-4" />
              Save
            </>
          ) : (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Saving
            </>
          )
        ) : (
          <span className="">Saved</span>
        )}
      </Button>
    </form>
  );
}
