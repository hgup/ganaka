import { DashMenubar } from "@components/menu/dashbaord-menubar";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <DashMenubar />
      {children}
    </>
  );
}
