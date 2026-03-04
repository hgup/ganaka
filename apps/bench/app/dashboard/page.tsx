import { fetchProjectsFetchProjectsGet } from "@api/dashboard/dashboard";
import { EmptyProjects } from "./components/empty";
import ProjectsDashboard from "./components/projects";

export default async function DashboardPage() {
  const { data } = await fetchProjectsFetchProjectsGet({cache: 'no-store'});
  return (
    <div className="flex flex-col  min-w-xl p-10">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-accent-foreground">Workbench</h1>
        <p className="text-muted-foreground pt-2">Welcome Back, Hursh</p>
      </header>
      {data.projects.length ? <ProjectsDashboard projects={data.projects} /> : <EmptyProjects />}
    </div>
  );
}
