import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline, type PaletteMode } from "@mui/material";
import { buildTheme } from "../theme";

interface ThemeCtx {
  mode: PaletteMode;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({ mode: "dark", toggle: () => {} });

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>(
    () => (localStorage.getItem("theme") as PaletteMode) || "dark"
  );

  const toggle = () =>
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
