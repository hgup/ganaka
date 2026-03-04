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

type NodeTypes = "methodNode" | "triangleNode";

// "Uploaded CSV"
export type TriangleNodeData = Record<string, unknown> & {
  fileName: string;
  isUploaded: boolean;
  id: string | null;
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
export type CanvasNode = Node<TriangleNodeData | MethodNodeData> & {
  type: NodeTypes;
};

interface CanvasState {
  // Core Canvas State
  nodes: CanvasNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  pendingNodeType: NodeTypes | null;

  // Canvas Actions (React Flow Requirements)
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Business Logic Actions
  addNode: (node: CanvasNode) => void;
  removeNode: (id: string | null) => void;
  selectNode: (id: string | null) => void;
  updateNodeData: (
    id: string,
    dataUpdate: Partial<TriangleNodeData | MethodNodeData>,
  ) => void;

  // Actions
  setPendingNode: (type: NodeTypes | null) => void;
  addNodeAtPosition: (
    type: NodeTypes,
    position: { x: number; y: number },
  ) => void;
  getNode: (id: string) => CanvasNode | null;
  clear: () => void;
  init: (project_id: string) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  init: (project_id) => {
    fetch(`/projects/${project_id}/data/canvas`)
      .then((res) => res.json())
      .then((d) => {
        if (!d.error) {
          const updates = JSON.parse(d);
          set({ ...updates });
        }
      });
  },
  clear: () => {
    set({ nodes: [], edges: [] });
  },
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
          ? { fileName: "DATA NOT SELECTED", isUploaded: false, id: null }
          : { methodType: "none" as const, config: {} },
    };

    get().addNode(newNode);
    set({
      selectedNodeId: id,
      pendingNodeType: null,
    });
  },

  getNode: (id) => get().nodes.find((n) => n.id === id) ?? null,

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

  removeNode: (id) => {
    set({ nodes: [...get().nodes.filter((n) => n.id !== id)] });
  },

  selectNode: (id) => {
    set({ selectedNodeId: id });
  },

  // This is the magic function the Right Sidebar uses to tweak parameters!
  updateNodeData: (id, dataUpdate) => {
    console.log("updating node data");
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
