import TopBar from "./components/layout/TopBar";
import { EmptyProjects } from "@/app/dashboard/components/empty";
import { getMetadataProjectGetMetadataGet } from "@api/reserving/reserving";
import Body from "./body";

// ─── Main Layout ──────────────────────────────────────────────────────────────

export default async function ReservingTool(
  props: PageProps<"/projects/[id]">,
) {
  const { id } = await props.params;
  const { status, data } = await getMetadataProjectGetMetadataGet({ id: id });
  if (status === 200)
    return (
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <TopBar name={data.name} />
        {/* ── Body ── */}
        <Body />
      </div>
    );
  else return;
  <EmptyProjects />;
}
