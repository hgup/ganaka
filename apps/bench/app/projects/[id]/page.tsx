import { EmptyProjects } from "@/app/dashboard/components/empty";
import Main from "./body";
import { getMetadataProjectGetMetadataGet } from "@api/project/project";

// ─── Main Layout ──────────────────────────────────────────────────────────────

export default async function ReservingTool(
  props: PageProps<"/projects/[id]">,
) {
  const { id } = await props.params;
  const { status, data } = await getMetadataProjectGetMetadataGet({ project_id: id });
  if (status === 200)
    return (
        <Main project_id={data.id} project_name={data.name} />
    );
  else return <EmptyProjects />;
}
