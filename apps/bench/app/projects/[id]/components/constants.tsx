import {
  Workflow,
  Table,
  Settings,
  Triangle,
} from "lucide-react";

export const MODELS = [
  // { id: 1, name: "Chain Ladder", type: "method", depth: 0, open: true },
  // { id: 2, name: "Development Factors", type: "table", depth: 1 },
  // { id: 3, name: "Selected LDFs", type: "table", depth: 1 },
  // { id: 4, name: "Bornhuetter-Ferguson", type: "method", depth: 0, open: true },
  // { id: 5, name: "A Priori Loss Ratio", type: "param", depth: 1 },
  // { id: 6, name: "Expected Losses", type: "table", depth: 1 },
];

export const DATA = [
  // { id: 1, name: "Triangle — Auto BI", type: "triangle", depth: 0 },
  // { id: 2, name: "Triangle — GL", type: "triangle", depth: 0 },
];

export const TYPE_ICON = {
  method: <Workflow className="h-3.5 w-3.5 text-blue-400" />,
  table: <Table className="h-3.5 w-3.5 text-emerald-400" />,
  param: <Settings className="h-3.5 w-3.5 text-amber-400" />,
  triangle: <Triangle className="h-3.5 w-3.5 text-violet-400" />,
};
