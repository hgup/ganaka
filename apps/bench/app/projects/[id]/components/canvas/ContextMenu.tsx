"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useCanvasStore } from "@/store/useCanvasStore";
import { PencilIcon, ShareIcon, TrashIcon } from "lucide-react";
import React from "react";

export function CanvasContextMenu({ children }: { children: React.ReactNode }) {
  const { selectedNodeId, removeNode } = useCanvasStore();
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="data-[state=closed]:animate-none! data-[state=open]:animate-none!" onContextMenu={(e) => {e.preventDefault()}} >
        <ContextMenuGroup>
          <ContextMenuItem>
            <PencilIcon />
            Edit
          </ContextMenuItem>
          <ContextMenuItem>
            <ShareIcon />
            Share
          </ContextMenuItem>
        </ContextMenuGroup>
        {selectedNodeId && (
          <>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem
                variant="destructive"
                onClick={() => {
                  removeNode(selectedNodeId);
                }}
              >
                <TrashIcon />
                Delete
              </ContextMenuItem>
            </ContextMenuGroup>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
