import { createTheme, type PaletteMode } from "@mui/material";

export const buildTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "dark"
        ? {
            background: { default: "#0E1525", paper: "#162031" },
            primary: { main: "#38BDF8" },
            text: { primary: "#F1F5F9", secondary: "#94A3B8" },
          }
        : {
            background: { default: "#F4F6F8", paper: "#FFFFFF" },
            primary: { main: "#0284C7" },
            text: { primary: "#0F172A", secondary: "#475569" },
          }),
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      h4: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: "1px solid",
            borderColor: mode === "dark" ? "rgba(255,255,255,0.08)" : "#E2E8F0",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });
