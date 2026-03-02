import DataDrawer from "../DataDrawer";

export default function DataInspector(): import("react").ReactNode {
  return <div className="flex flex-col gap-4 justify-center">
    <span className="px-3 py-4 text-xs text-muted-foreground text-center">Select a node to view its properties. </span>
    <DataDrawer />
  </div>;
}
