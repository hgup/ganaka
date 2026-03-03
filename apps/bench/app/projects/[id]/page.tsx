import TopBar from "./components/layout/TopBar";
import { EmptyProjects } from "@/app/dashboard/components/empty";
import Body from "./body";
import { getMetadataProjectGetMetadataGet } from "@api/project/project";

// ─── Main Layout ──────────────────────────────────────────────────────────────

export default async function ReservingTool(
  props: PageProps<"/projects/[id]">,
) {
  const { id } = await props.params;
  const { status, data } = await getMetadataProjectGetMetadataGet({ project_id: id });
  if (status === 200)
    return (
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <TopBar name={data.name} />
        {/* ── Body ── */}
        <Body />
      </div>
    );
  else return <EmptyProjects />;
}
