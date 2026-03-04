"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by waiting until mounted
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  return (
        <Switch 
          id="theme-toggle" 
          size="sm" 
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
  )
}  