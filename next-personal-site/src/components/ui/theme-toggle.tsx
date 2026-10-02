"use client"

import { Moon, Sun, SunMoon } from "lucide-react"
import { useTheme } from "next-themes"
import { RadioGroup } from "radix-ui"
import * as React from "react"

const themes = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: SunMoon },
]

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { setTheme, theme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <RadioGroup.Root
      aria-label="Color theme"
      orientation="horizontal"
      value={mounted ? theme ?? "system" : ""}
      onValueChange={setTheme}
      disabled={!mounted}
      className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-input p-0.5"
    >
      {themes.map(({ value, label, Icon }) => (
        <RadioGroup.Item
          key={value}
          value={value}
          aria-label={label}
          title={`${label} theme`}
          className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=checked]:bg-brand data-[state=checked]:text-brand-foreground"
        >
          <Icon aria-hidden="true" className="size-4" />
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}
