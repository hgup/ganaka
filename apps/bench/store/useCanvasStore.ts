import { create } from "zustand";
import {
  Node,
  Edge,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";

// "Uploaded CSV"
export type TriangleNodeData = Record<string, unknown> & {
  fileName: string;
  isUploaded: boolean;
  metadata?: {
    originYears: number;
    devPeriods: number;
    totalLoss: number;
  };
};
export type MethodType = "none" | "chainladder" | "bf" | "capecod";

// Generic "Method Node"
export type MethodNodeData = Record<string, unknown> & {
  methodType: MethodType;
  // Parameters for specific methods
  config: {
    averageMethod?: "volume" | "simple" | "regression"; // cl.Development params
    nPeriods?: number | "all";
    lrt?: number; // for BF
  };
  results?: {
    totalIbnr: number;
  };
};

// Combine them into a custom Node type for strict typing
export type CanvasNode = Node<TriangleNodeData | MethodNodeData>;

interface CanvasState {
  // Core Canvas State
  nodes: CanvasNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  pendingNodeType: "triangleNode" | "methodNode" | null;

  // Canvas Actions (React Flow Requirements)
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Business Logic Actions
  addNode: (node: CanvasNode) => void;
  selectNode: (id: string | null) => void;
  updateNodeData: (
    id: string,
    dataUpdate: Partial<TriangleNodeData | MethodNodeData>,
  ) => void;

  // Actions
  setPendingNode: (type: "triangleNode" | "methodNode" | null) => void;
  addNodeAtPosition: (
    type: "triangleNode" | "methodNode",
    position: { x: number; y: number },
  ) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  pendingNodeType: null,

  setPendingNode: (type) => {
    set({ pendingNodeType: type });
  },

  addNodeAtPosition: (type, position) => {
    const id = `${type}-${Date.now()}`;
    const newNode: CanvasNode = {
      id,
      type,
      position, // mouse coords
      data:
        type === "triangleNode"
          ? { fileName: "Drop CSV here...", isUploaded: false }
          : { methodType: "none" as const, config: {} },
    };
    get().addNode(newNode);
    set({
      selectedNodeId: id,
      pendingNodeType: null,
    });
  },

  // --- REACT FLOW MECHANICS ---
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as CanvasNode[] });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onConnect: (connection) => {
    // Only allow connection if we don't already have one (keep MVP simple)
    set({ edges: addEdge(connection, get().edges) });
  },

  // --- YOUR APP LOGIC ---
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },

  selectNode: (id) => {
    set({ selectedNodeId: id });
  },

  // This is the magic function the Right Sidebar uses to tweak parameters!
  updateNodeData: (id, dataUpdate) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          // Merge the existing data with the new tweaks (e.g., changing 'volume' to 'simple')
          return {
            ...node,
            data: { ...node.data, ...dataUpdate },
          };
        }
        return node;
      }),
    });
  },
}));
