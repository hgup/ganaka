import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import DataIngestionWizard from "@/app/projects/[id]/data/data-upload";
import { useParams } from "next/navigation";
import { DatasetMeta, useUIStore } from "@/store/useUIStore";
import { Button } from "@ui/button";
import { RefreshCcw } from "lucide-react";
import { TriangleNodeData, useCanvasStore } from "@/store/useCanvasStore";
import { cn } from "@lib/utils";
// import { TYPE_ICON } from "../../constants";

export function Data() {
  const uploading = useUIStore((s) => s.leftSidebar.data.uploading);

  //   Nodes
  const selectedNodeId = useCanvasStore((s) => s.selectedNodeId) ?? "";
  const updateNode = useCanvasStore((s) => s.updateNodeData);
  const selectedNode = useCanvasStore((s) => s.getNode)(selectedNodeId);
  const handleDatasetChange = (d: DatasetMeta) => {
    if (selectedNode && selectedNode.type === "triangleNode") {
      // Triangle node gets its data from here.
      updateNode<TriangleNodeData>(selectedNodeId, {
        fileName: d.name,
        isUploaded: true,
        dataId: d.id,
        availableMeasures: d.measures,
        metadata: {
          devRange: [2004,2005],
          isCumulative: true,
          originRange: [2004,2005],
          rowCount: 10
        }
      });
    }
  };

  //   Uploading states
  const setUploading = useUIStore((s) => s.setUploadingDataset);
  const datasets = useUIStore((s) => s.leftSidebar.data.datasets);
  const fetchDatasets = useUIStore((s) => s.fetchDatasets);
  const { id: project_id } = useParams<{ id: string }>();

  if (!uploading)
    return (
      <div className="flex flex-col h-full  pt-2 gap-2 ">
        <Card className="ring-0 border-dashed border mt-0 m-2 h-16 justify-center text-center">
          {selectedNodeId ? (
            <p className="text-pretty text-xs text-accent-foreground">
              {selectedNodeId.split("-").at(-1)} <br />{" "}
              <span className="text-muted-foreground">SELECTED NODE</span>{" "}
            </p>
          ) : (
            <CardHeader className="text-center text-xs text-muted-foreground">
              No node selected
            </CardHeader>
          )}
        </Card>
        <div className="flex gap-1 pl-2 pr-1">
          <Button className="grow" onClick={() => setUploading(true)}>
            Add New Dataset
          </Button>
          <Button
            className="aspect-square"
            variant={"ghost"}
            onClick={() => fetchDatasets(project_id)}
          >
            <RefreshCcw />
          </Button>
        </div>
        {datasets.length === 0 ? (
          <div className="w-full px-3 py-4 text-xs text-muted-foreground text-center">
            Upload Data to get started.
          </div>
        ) : (
          <p className="text-muted-foreground text-xs text-center w-full py-4">
            or select from existing
          </p>
        )}
        {datasets.map((d) => (
          <DatasetComponent
            key={d.id}
            d={d}
            onClick={handleDatasetChange}
            enabled={selectedNode && selectedNode.type == "triangleNode"}
          />
        ))}
      </div>
    );
  if (uploading)
    return (
      <div className="flex flex-col px-2 h-full">
        <DataIngestionWizard />
        <Button
          className="mt-4"
          variant={"secondary"}
          onClick={() => setUploading(false)}
        >
          Cancel
        </Button>
      </div>
    );
}

function DatasetComponent({
  d,
  onClick,
  enabled,
}: {
  d: DatasetMeta;
  onClick: (d:DatasetMeta) => void;
  enabled: boolean | null;
}) {
  //   const TableIcon = TYPE_ICON.table;
  return (
    <Card
      className={cn(
        "bg-muted",
        enabled ? "hover:bg-background cursor-pointer" : "opacity-60 ",
      )}
      onClick={() => onClick(d)}
    >
      <CardHeader className="flex flex-row items-center m-0">
        <div className="inline-flex flex-col *:p-0">
          <CardTitle>{d.name}</CardTitle>
          <CardDescription>{d.original_filename}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-row gap-4 m-0">
        <span>{d.table_type}</span>
        <div className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap">
          {/* Formats like "55 r" based on your screenshot */}
          {d.row_count > 999
            ? `${(d.row_count / 1000).toFixed(1)}k r`
            : `${d.row_count} r`}
        </div>
      </CardContent>
      {/* The tiny dark badge for row count shown in the image */}
    </Card>
  );
}
