import { useState } from "react";
import { Eye, EyeOff, Lock, Unlock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TYPE_ICON } from "../../constants";

interface Layer {
  id: number;
  name: string;
  type: "method" | "table" | "param" | "triangle";
  depth: number;
  open?: boolean;
}

interface LayerRowProps {
  layer: Layer;
}

export function LayerRow({ layer }: LayerRowProps) {
  const [visible, setVisible] = useState(true);
  const [locked, setLocked] = useState(false);

  return (
    <div
      className="group flex items-center gap-1.5 px-2 py-1 rounded-sm hover:bg-accent cursor-pointer text-sm"
      style={{ paddingLeft: `${8 + layer.depth * 16}px` }}
    >
      {layer.open !== undefined ? (
        <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
      ) : (
        <span className="w-3 shrink-0" />
      )}
      <span className="shrink-0">{TYPE_ICON[layer.type]}</span>
      <span className="flex-1 truncate text-xs">{layer.name}</span>
      <span className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={(e) => {
            e.stopPropagation();
            setVisible(!visible);
          }}
        >
          {visible ? (
            <Eye className="h-3 w-3 text-muted-foreground" />
          ) : (
            <EyeOff className="h-3 w-3 text-muted-foreground" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={(e) => {
            e.stopPropagation();
            setLocked(!locked);
          }}
        >
          {locked ? (
            <Lock className="h-3 w-3 text-muted-foreground" />
          ) : (
            <Unlock className="h-3 w-3 text-muted-foreground" />
          )}
        </Button>
      </span>
    </div>
  );
}
