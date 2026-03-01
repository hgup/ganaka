"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Laptop } from "lucide-react";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@ui/menubar";
import Link from "next/link";

export function DashMenubar() {
  const { setTheme } = useTheme();

  return (
    <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
      {/* Standard Menu Items */}
      <MenubarMenu>
        <MenubarTrigger asChild className="font-bold mr-5">
            <Link href="/dashboard">Home</Link>
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="font-bold">Projects</MenubarTrigger>
        <MenubarContent>
          <MenubarItem asChild>
            <Link href="/projects/new">New Project</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      {/* Theme Switching Menu */}
      <MenubarMenu>
        <MenubarTrigger>Theme</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </MenubarItem>
          <MenubarItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </MenubarItem>
          <MenubarItem onClick={() => setTheme("system")}>
            <Laptop className="mr-2 h-4 w-4" />
            <span>System</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
