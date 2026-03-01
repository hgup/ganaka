import { Button } from "@/components/ui/button";
import { Folder } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@ui/empty";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";

export function EmptyProjects() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
           <HugeiconsIcon icon={Folder}  />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button>
          <Link href="/projects/new">Create Project</Link>
        </Button>
        {/* <Button variant="outline">Import Project</Button> */}
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground hidden"
        size="sm"
      >
        <a href="#">
          Learn More <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
  );
}
