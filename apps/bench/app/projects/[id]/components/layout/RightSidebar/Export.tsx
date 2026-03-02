import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@ui/button";
import { MoreHorizontal } from "lucide-react";
import { SidebarSection } from "../LeftSidebar/SidebarSection";
{
  /* Export */
}
export default function ExportSection() {
  return (
    <SidebarSection className="py-1 border-t" title="Export">
      <div className="px-3 pb-2 space-y-2">
        <div className="flex items-center gap-2">
          <Select defaultValue="1x">
            <SelectTrigger className="h-7 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1x">1x</SelectItem>
              <SelectItem value="2x">2x</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="xlsx">
            <SelectTrigger className="h-7 flex-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xlsx">XLSX</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Button variant="outline" size="sm" className="w-full h-7 text-xs">
          Export Study
        </Button>
      </div>
    </SidebarSection>
  );
}
