"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

interface LanguageToggleProps {
  language: "en" | "hi"
  onLanguageChange: (language: "en" | "hi") => void
}

export function LanguageToggle({ language, onLanguageChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <div className="flex rounded-md border">
        <Button
          variant={language === "en" ? "default" : "ghost"}
          size="sm"
          onClick={() => onLanguageChange("en")}
          className="rounded-r-none"
        >
          English
        </Button>
        <Button
          variant={language === "hi" ? "default" : "ghost"}
          size="sm"
          onClick={() => onLanguageChange("hi")}
          className="rounded-l-none"
        >
          हिंदी
        </Button>
      </div>
    </div>
  )
}
