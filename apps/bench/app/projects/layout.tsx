import { DashMenubar } from "@components/menu/dashbaord-menubar";

export default function ProjectsLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <DashMenubar />
      {children}
    </>
  );
}
