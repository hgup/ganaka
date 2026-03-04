"use client";
import { useState } from "react";
import {
  Search,
  FolderOpen,
  Calendar,
  Clock,
  Hash,
  ChevronRight,
  LayoutGrid,
  List,
  Plus,
} from "lucide-react";
import { Input } from "@ui/input";
import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader } from "@ui/card";
import { Separator } from "@ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FetchTablesResponse } from "@api/schemas/fetchTablesResponse.zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function relativeTime(dateStr: string) {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000,
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return formatDate(dateStr);
}

export default function ProjectsDashboard({ projects }: FetchTablesResponse) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("lastOpened");
  const [view, setView] = useState("grid");
  const router = useRouter();

  const filtered = projects
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        // p.original_filename.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sort === "lastOpened")
        return (
          new Date(b.last_modified).getTime() -
          new Date(a.last_modified).getTime()
        );
      if (sort === "created")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-background pb-8 min-w-full lg:min-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {projects.length} project(s) total
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastOpened">Last opened</SelectItem>
            <SelectItem value="created">Date created</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex border rounded-md">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-r-none border-r"
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-l-none"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="group cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="font-medium text-sm leading-snug">
                        {project.name}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-2.5">
                  <Separator />

                  <div className="grid gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-mono">{project.id}</span>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <Table2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-mono truncate">
                        {project.original_filename}
                      </span>
                    </div> */}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>Created {formatDate(project.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>Opened {relativeTime(project.last_modified)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          <Card
            className=" group hover:bg-muted ring-0  items-center duration-100 transition-all text-muted-foreground justify-center cursor-pointer"
            onClick={() => router.push("/projects/new")}
          >
            <Plus />
          </Card>
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Project ID</TableHead>
                {/* <TableHead>Claims Table</TableHead> */}
                <TableHead>Created</TableHead>
                <TableHead>Last Opened</TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((project) => (
                <TableRow
                  key={project.id}
                  className="cursor-pointer group"
                  onClick={() => {
                    router.push(`/projects/${project.id}`);
                  }}
                >
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {project.id}
                    </Badge>
                  </TableCell>
                  {/* <TableCell className="font-mono text-sm text-muted-foreground">
                    {project.original_filename}
                  </TableCell> */}
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(project.created_at)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {relativeTime(project.last_modified)}
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </TableCell>
                </TableRow>
              ))}

              <TableRow onClick={() => router.push(`/projects/new`)}>
                <TableCell
                  colSpan={5}
                  className="justify-center text-muted-foreground cursor-pointer"
                >
                  <span className="flex flex-row justify-center">
                    <Plus className="size-4 mr-2" /> Create New
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No projects match your search.
        </div>
      )}
    </div>
  );
}
