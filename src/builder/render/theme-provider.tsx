import { createContext, useContext, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { defaultTheme } from "@/builder/theme/defaults";
import { toCssVars } from "@/builder/theme/css-vars";
import type { Theme, ThemeMode } from "@/builder/theme/schema";

/**
 * Builder theme provider (M1). Owns the theme + light/dark mode for the
 * builder tree (editor canvas and published pages both mount it in M3).
 * Tokens reach components as scoped `--bld-*` CSS variables, so a token edit
 * restyles the whole tree instantly through one inline-style update.
 */

interface BuilderThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const BuilderThemeContext = createContext<BuilderThemeContextValue>({
  theme: defaultTheme,
  mode: "light",
  setMode: () => {},
  toggleMode: () => {},
});

export function useBuilderTheme(): BuilderThemeContextValue {
  return useContext(BuilderThemeContext);
}

interface ThemeProviderProps {
  theme?: Theme;
  mode?: ThemeMode;
  defaultMode?: ThemeMode;
  onModeChange?: (mode: ThemeMode) => void;
  className?: string;
  children: ReactNode;
}

export function ThemeProvider({
  theme = defaultTheme,
  mode: controlledMode,
  defaultMode = "light",
  onModeChange,
  className = "",
  children,
}: ThemeProviderProps) {
  const [uncontrolledMode, setUncontrolledMode] = useState<ThemeMode>(defaultMode);
  const mode = controlledMode ?? uncontrolledMode;

  const setMode = (next: ThemeMode) => {
    if (controlledMode === undefined) setUncontrolledMode(next);
    onModeChange?.(next);
  };

  const value = useMemo<BuilderThemeContextValue>(
    () => ({
      theme,
      mode,
      setMode,
      toggleMode: () => setMode(mode === "light" ? "dark" : "light"),
    }),
    // `setMode` closes over the current mode; rebuilding on theme/mode change is intended.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, mode],
  );

  const vars = useMemo(() => toCssVars(theme, mode), [theme, mode]);

  return (
    <BuilderThemeContext.Provider value={value}>
      <div className={`${mode === "dark" ? "dark" : ""} ${className}`} style={vars as CSSProperties}>
        {children}
      </div>
    </BuilderThemeContext.Provider>
  );
}
