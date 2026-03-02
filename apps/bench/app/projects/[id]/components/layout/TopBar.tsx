'use client'
import {
//   Play,
//   Share2,
  BarChart2,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function TopBar(props: {name: string}) {

    return <header className="flex items-center justify-between px-3 h-12 border-b bg-background shrink-0 z-10">
        {/* Left: app name + project */}
        <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-1.5 font-semibold text-sm">
                <BarChart2 className="h-4 w-4 text-primary" />
                <span>Ganaka</span>
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-sm font-normal">
                {props.name}
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
            <Badge variant="outline" className="text-xs font-normal">Drafts</Badge>
        </div>


        {/* Right: actions */}
        {/* <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <Play className="h-4 w-4" />
            </Button>
            <Button size="sm" className="h-7 gap-1.5">
                <Share2 className="h-3.5 w-3.5" />
                Share
            </Button>
        </div> */}
    </header>;
}