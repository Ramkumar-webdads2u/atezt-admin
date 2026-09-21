"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

type Theme = "light" | "dark" | "system";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "system";
  const saved = localStorage.getItem("nextcode-theme") as Theme | null;
  return saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
};

const ThemeButton = () => {
  const [theme, setThemeState] = React.useState<Theme>("system");

  React.useEffect(() => {
    const initial = getInitialTheme();
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = (value: Theme) => {
    setThemeState(value);
    localStorage.setItem("nextcode-theme", value);
    applyTheme(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" rounded="full" className="md:bg-secondary bg-transparent text-secondary-foreground hover:ring-0 md:h-8 md:w-8 h-auto w-auto">
          <Sun className="h-[1.2rem] w-[1.2rem] dark:hidden" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] hidden dark:block" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2">
        {(["light", "dark", "system"] as Theme[]).map((item) => (
          <DropdownMenuItem
            key={item}
            onClick={() => setTheme(item)}
            className={cn("p-2 font-medium text-sm cursor-pointer mb-[2px]", {
              "bg-default text-default-foreground": theme === item,
            })}
          >
            <Icon icon={item === "light" ? "heroicons-outline:sun" : item === "dark" ? "heroicons-outline:moon" : "heroicons:computer-desktop"} className="w-5 h-5 me-2" />
            <span className="me-2 capitalize">{item}</span>
            {theme === item && <Check className="w-4 h-4 ms-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeButton;
